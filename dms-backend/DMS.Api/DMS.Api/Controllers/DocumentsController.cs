using DMS.Api.Domain.Entities;
using DMS.Api.DTOs;
using DMS.Api.Infrastructure.Persistance;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DocumentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] Guid? folderId,
        [FromQuery] string type = "all")
        {
            if (string.IsNullOrWhiteSpace(q))
                return Ok(new List<SearchResultDto>());

            q = q.ToLower();

            var results = new List<SearchResultDto>();

            /* -----------------------
               Search Files
            ------------------------ */
            if (type == "all" || type == "file")
            {
                var filesQuery = _context.Documents
                    .Where(f => !f.IsDeleted &&
                                f.OriginalName.ToLower().Contains(q));

                if (folderId.HasValue)
                    filesQuery = filesQuery.Where(f => f.FolderId == folderId);

                var files = await filesQuery
                    .Select(f => new SearchResultDto
                    {
                        Id = f.Id,
                        Name = f.OriginalName,
                        Type = "file",
                        Extension = f.Extension,
                        Size = f.Size,
                        CreatedAt = f.CreatedAt
                    })
                    .ToListAsync();

                results.AddRange(files);
            }

            /* -----------------------
               Search Folders
            ------------------------ */
            if (type == "all" || type == "folder")
            {
                var foldersQuery = _context.Folders
                    .Where(f => !f.IsDeleted &&
                                f.Name.ToLower().Contains(q));

                if (folderId.HasValue)
                    foldersQuery = foldersQuery.Where(f => f.ParentFolderId == folderId);

                var folders = await foldersQuery
                    .Select(f => new SearchResultDto
                    {
                        Id = f.Id,
                        Name = f.Name,
                        Type = "folder",
                        CreatedAt = f.CreatedAt
                    })
                    .ToListAsync();

                results.AddRange(folders);
            }

            return Ok(results.OrderByDescending(x => x.CreatedAt));
        }

        [HttpGet("GetRootFolder")]
        public  async Task<IActionResult> GetRootFolder()
        {
           var root = await _context.Folders.Where(c => c.ParentFolderId == null && c.Name == "Root").FirstAsync();
         
          return Ok(root);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, [FromForm] string folderId)
        {
            Guid? folderGuid = null;
            if (!string.IsNullOrWhiteSpace(folderId) && Guid.TryParse(folderId, out var g))
            {
                folderGuid = g;
            }
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            var uploadRoot = FileStorageHelper.EnsureUploadPath();

            // Create year/month folder
            var year = DateTime.UtcNow.Year.ToString();
            var month = DateTime.UtcNow.Month.ToString("D2");

            var directory = Path.Combine(uploadRoot, year, month);
            Directory.CreateDirectory(directory);

            var documentId = Guid.NewGuid();
            var storedName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullPath = Path.Combine(directory, storedName);

            // Save file to disk
            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            // Save metadata
            var document = new Document
            {
                Id = documentId,
                OriginalName = file.FileName,
                StoredName = storedName,
                Extension = Path.GetExtension(file.FileName),
                Size = file.Length,
                FolderId = folderGuid,
                CreatedBy = User.Identity?.Name ?? "System",
                CreatedAt = DateTime.UtcNow
            };

            _context.Documents.Add(document);

            // Version 1
            var document_ver = new DocumentVersion
            {
                Id = Guid.NewGuid(),
                DocumentId = documentId,
                VersionNumber = 1,
                StoredPath = fullPath,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = document.CreatedBy
            };

            _context.DocumentVersions.Add(document_ver);

            await _context.SaveChangesAsync();

            var doc = new DocumentDto
            {
                Extension = document.Extension,
                Id = document.Id,
                OriginalName = file.FileName,
                Size = file.Length,
                Versions = document.Versions.Select(dv=> new DocumentVersionDto
                {
                    CreatedAt = dv.CreatedAt,
                    VersionNumber = dv.VersionNumber,
                }).ToList()
            };

            return Ok(doc);
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(Guid id)
        {
            var doc = await _context.Documents.FindAsync(id);
            if (doc == null) return NotFound();

            var version = await _context.DocumentVersions
                .Where(v => v.DocumentId == id)
                .OrderByDescending(v => v.VersionNumber)
                .FirstAsync();

            var bytes = await System.IO.File.ReadAllBytesAsync(version.StoredPath);
            return File(bytes, "application/octet-stream", doc.OriginalName);
        }

        [HttpPost("{id}/upload-version")]
        public async Task<IActionResult> UploadNewVersion(Guid id, IFormFile file)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null) return NotFound();

            var latestVersion = await _context.DocumentVersions
                .Where(v => v.DocumentId == id)
                .MaxAsync(v => v.VersionNumber);

            var storedName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var path = Path.Combine(FileStorageHelper.EnsureUploadPath(), storedName);

            using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);

            _context.DocumentVersions.Add(new DocumentVersion
            {
                Id = Guid.NewGuid(),
                DocumentId = id,
                VersionNumber = latestVersion + 1,
                StoredPath = path,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = User.Identity?.Name ?? "System"
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("folders")]
        public async Task<IActionResult> CreateFolder(string name, Guid? parentFolderId)
        {
            var folder = new Folder
            {
                Id = Guid.NewGuid(),
                Name = name,
                ParentFolderId = parentFolderId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = User.Identity?.Name ?? "System"
            };

            _context.Folders.Add(folder);
            await _context.SaveChangesAsync();

            return Ok(folder);
        }

        [HttpGet("folders/{folderId}/contents")]
        public async Task<IActionResult> GetFolderContents(Guid? folderId)
        {
            var folders = await _context.Folders
                .Where(f => f.ParentFolderId == folderId && !f.IsDeleted)
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    Type = "folder",
                    f.CreatedAt
                })
                .ToListAsync();

            var files = await _context.Documents
                .Where(d => d.FolderId == folderId && !d.IsDeleted)
                .Select(d => new
                {
                    d.Id,
                    d.OriginalName,
                    Type = "file",
                    ext= d.Extension,
                    d.Size,
                    d.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                Folders = folders,
                Files = files
            });
        }


        [HttpPut("files/{id}/rename")]
        public async Task<IActionResult> RenameFile(Guid id, string newName)
        {
            var folder = await _context.Documents.FindAsync(id);
            if (folder == null) return NotFound();

            folder.OriginalName = newName;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("folders/{id}/rename")]
        public async Task<IActionResult> RenameFolder(Guid id, string newName)
        {
            var folder = await _context.Folders.FindAsync(id);
            if (folder == null) return NotFound();

            folder.Name = newName;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("folders/{id}")]
        public async Task<IActionResult> DeleteFolder(Guid id)
        {
            var folder = await _context.Folders.FindAsync(id);
            if (folder == null) return NotFound();

            folder.IsDeleted = true;

            // Soft-delete files inside folder
            var files = _context.Documents.Where(d => d.FolderId == id);
            foreach (var file in files)
                file.IsDeleted = true;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var doc = await _context.Documents.FindAsync(id);
            if (doc == null) return NotFound();

            doc.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("folders/{id}/breadcrumb")]
        public async Task<IActionResult> GetBreadcrumb(Guid id)
        {
            var breadcrumb = new List<object>();
            var current = await _context.Folders.FindAsync(id);

            while (current != null)
            {
                breadcrumb.Add(new { current.Id, current.Name });
                current = current.ParentFolderId == null
                    ? null
                    : await _context.Folders.FindAsync(current.ParentFolderId);
            }

            breadcrumb.Reverse();
            return Ok(breadcrumb);
        }

    }
}
