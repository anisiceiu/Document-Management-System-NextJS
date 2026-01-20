namespace DMS.Api.DTOs
{
    public class SearchResultDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!; // file | folder
        public string? Extension { get; set; }
        public long? Size { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
