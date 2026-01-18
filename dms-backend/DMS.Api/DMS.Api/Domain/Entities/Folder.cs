namespace DMS.Api.Domain.Entities;
public class Folder
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    public Guid? ParentFolderId { get; set; }
    public Folder ParentFolder { get; set; }

    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public bool IsDeleted { get; set; }

    public ICollection<Folder> Children { get; set; }
    public ICollection<Document> Documents { get; set; }
}
