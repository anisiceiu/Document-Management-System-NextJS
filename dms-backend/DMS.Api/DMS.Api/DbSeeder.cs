using DMS.Api.Domain.Entities;
using DMS.Api.Infrastructure.Persistance;

namespace DMS.Api
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            if (!context.Folders.Any())
            {
                context.Folders.Add(new Folder
                {
                    Id = Guid.NewGuid(),
                    Name = "Root",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                });
                context.SaveChanges();
            }
        }
    }

}
