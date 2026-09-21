namespace backend.Models;

public class JsSnippet : Snippet
{
    public override string Language => "javascript";
    public override string FileExtension => ".js";
    protected override string CommentPrefix => "//";
}