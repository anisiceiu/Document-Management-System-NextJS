
namespace DMS.Api.Domain.Entities;
public class DocumentVersion
{
    public Guid Id { get; set; }

    public Guid DocumentId { get; set; }
    public Document Document { get; set; }

    public int VersionNumber { get; set; }
    public string StoredPath { get; set; }

    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
}
