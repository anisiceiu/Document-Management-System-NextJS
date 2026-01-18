namespace DMS.Api
{
    public static class FileStorageHelper
    {
        public static string EnsureUploadPath()
        {
            var root = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(root))
                Directory.CreateDirectory(root);

            return root;
        }
    }

}
