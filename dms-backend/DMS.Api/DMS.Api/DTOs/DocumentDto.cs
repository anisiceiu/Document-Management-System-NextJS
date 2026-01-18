namespace DMS.Api.DTOs
{
    public class DocumentDto
    {
        public Guid Id { get; set; }
        public string OriginalName { get; set; }
        public string Extension { get; set; }
        public long Size { get; set; }

        public List<DocumentVersionDto> Versions { get; set; }
    }

}
