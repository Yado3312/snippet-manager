namespace backend.Models;

public abstract class Snippet
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Code { get; set; } = "";
    public string Tags { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Lo que cambia según el lenguaje: cada subclase lo define
    public abstract string Language { get; }
    public abstract string FileExtension { get; }
    protected abstract string CommentPrefix { get; }

    // Contenido listo para copiar o descargar, con el título como comentario
    public string ToFileContent() =>
        $"{CommentPrefix} {Title}{Environment.NewLine}{Code}";
}