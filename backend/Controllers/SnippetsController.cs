using System.Globalization;
using backend.Data;
using backend.Factories;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public record CreateSnippetRequest(string Language, string Title, string Code, string? Tags);

[ApiController]
[Route("api/[controller]")]
public class SnippetsController : ControllerBase
{
    // Gey
    [HttpGet]
    public IActionResult GetAll([FromQuery] string? search, [FromQuery] string? language)
    {
        search = string.IsNullOrWhiteSpace(search) ? null : search.Trim();
        language = string.IsNullOrWhiteSpace(language) ? null : language.Trim().ToLowerInvariant();

        // un select simplon para ver la tabla de los snipets con nuestra instancia de la conexion a la db 
        using var connection = DatabaseManager.Instance.CreateConnection();
        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, Title, Language, Code, Tags, CreatedAt
            FROM Snippets
            WHERE (@search IS NULL OR Title LIKE @like OR Tags LIKE @like OR Code LIKE @like)
              AND (@language IS NULL OR Language = @language)
            ORDER BY CreatedAt DESC;
            """;

        // Parametros de busqued
        command.Parameters.AddWithValue("@search", (object?)search ?? DBNull.Value);
        command.Parameters.AddWithValue("@like", $"%{search}%");
        command.Parameters.AddWithValue("@language", (object?)language ?? DBNull.Value);

        var snippets = new List<Snippet>();
        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            // el Factory reconstruye el tipo correcto a partir de la fila
            snippets.Add(SnippetFactory.Create(
                language:  reader.GetString(2),
                title:     reader.GetString(1),
                code:      reader.GetString(3),
                tags:      reader.GetString(4),
                id:        reader.GetInt32(0),
                createdAt: DateTime.Parse(reader.GetString(5), CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)));
        }

        return Ok(snippets);
    }

    // GET de lenguages
    [HttpGet("languages")]
    public IActionResult GetLanguages() => Ok(SnippetFactory.SupportedLanguages);

    // POST de los snippets
    [HttpPost]
    public IActionResult Create([FromBody] CreateSnippetRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Code))
            return BadRequest(new { error = "El título y el código son obligatorios." });

        Snippet snippet;
        try
        {
            // desicion dentro de nuestro constructor para saber que clase crear
            snippet = SnippetFactory.Create(
                request.Language, request.Title.Trim(), request.Code, request.Tags?.Trim() ?? "");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }

        // acac el insert de la instancia creada en DatabaseManager (Para guarfrdar el snipept)
        using var connection = DatabaseManager.Instance.CreateConnection();
        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO Snippets (Title, Language, Code, Tags, CreatedAt)
            VALUES (@title, @language, @code, @tags, @createdAt);
            SELECT last_insert_rowid();
            """;
        command.Parameters.AddWithValue("@title", snippet.Title);
        command.Parameters.AddWithValue("@language", snippet.Language);
        command.Parameters.AddWithValue("@code", snippet.Code);
        command.Parameters.AddWithValue("@tags", snippet.Tags);
        command.Parameters.AddWithValue("@createdAt", snippet.CreatedAt.ToString("o", CultureInfo.InvariantCulture));

        snippet.Id = Convert.ToInt32(command.ExecuteScalar());
        return Created($"/api/snippets/{snippet.Id}", snippet);
    }

    // Delete
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        using var connection = DatabaseManager.Instance.CreateConnection();
        using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM Snippets WHERE Id = @id;";
        command.Parameters.AddWithValue("@id", id);

        return command.ExecuteNonQuery() == 0 ? NotFound() : NoContent();
    }
}