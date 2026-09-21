namespace backend.Models;

public class PythonSnippet : Snippet
{
    public override string Language => "python";
    public override string FileExtension => ".py";
    protected override string CommentPrefix => "#";
}