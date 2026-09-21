using backend.Models;

namespace backend.Factories;

public static class SnippetFactory
{
    // Lista para llenar el dropwdown de lenguaje
    public static readonly IReadOnlyList<string> SupportedLanguages =
        new[] { "javascript", "python", "sql" };

    public static Snippet Create(
        string language,
        string title,
        string code,
        string tags = "",
        int id = 0,
        DateTime? createdAt = null)
    {
        // Distintivo factory del profe ramses, decidimos que clase crear dependiendo de lo que se dicte al inicio 
        Snippet snippet = (language ?? "").Trim().ToLowerInvariant() switch
        {
            "javascript" => new JsSnippet(),
            "python"     => new PythonSnippet(),
            "sql"        => new SqlSnippet(),
            _ => throw new ArgumentException($"Todavia no tengo este lenguaje bro: {language}")
        };

        snippet.Id = id;
        snippet.Title = title;
        snippet.Code = code;
        snippet.Tags = tags;
        snippet.CreatedAt = createdAt ?? DateTime.UtcNow;

        return snippet;
    }
}