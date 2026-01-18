namespace DMS.Api.Domain.Entities;
public class Document
{
    public Guid Id { get; set; }
    public string OriginalName { get; set; }
    public string StoredName { get; set; }
    public string Extension { get; set; }
    public long Size { get; set; }

    public Guid? FolderId { get; set; }
    public Folder Folder { get; set; }

    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public bool IsDeleted { get; set; }

    public ICollection<DocumentVersion> Versions { get; set; }
}
