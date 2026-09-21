namespace backend.Models;

public class SqlSnippet : Snippet
{
    public override string Language => "sql";
    public override string FileExtension => ".sql";
    protected override string CommentPrefix => "--";
}