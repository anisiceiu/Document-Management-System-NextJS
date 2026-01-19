using DMS.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
namespace DMS.Api.Infrastructure.Persistance;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Folder> Folders { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<DocumentVersion> DocumentVersions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Folder self-referencing
        modelBuilder.Entity<Folder>()
            .HasOne(f => f.ParentFolder)
            .WithMany(f => f.Children)
            .HasForeignKey(f => f.ParentFolderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Folder -> Documents
        modelBuilder.Entity<Document>()
            .HasOne(d => d.Folder)
            .WithMany(f => f.Documents)
            .HasForeignKey(d => d.FolderId);

        // Document -> Versions
        modelBuilder.Entity<DocumentVersion>()
            .HasOne(v => v.Document)
            .WithMany(d => d.Versions)
            .HasForeignKey(v => v.DocumentId);

        modelBuilder.Entity<Document>()
    .HasIndex(d => d.FolderId);

        modelBuilder.Entity<Folder>()
            .HasIndex(f => f.ParentFolderId);
    }
}
