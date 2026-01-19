using DMS.Api.Domain.Entities;
using DMS.Api.DTOs;
using DMS.Api.Infrastructure;
using DMS.Api.Infrastructure.Persistance;
using DMS.Api.Migrations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private JwtService jwtService;
        private ApplicationDbContext context;
        public AuthController(JwtService _jwtService,ApplicationDbContext applicationDbContext)
        {
           jwtService = _jwtService;
           context = applicationDbContext;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync(RegisterDto dto)
        {
            var userExists = await context.Users.Where(c => c.Email == dto.Email).FirstOrDefaultAsync();
            if (userExists != null)
                throw new Exception("Email already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(dto);
        }

        [HttpPost("Login")]
        public async Task<AuthResponse> LoginAsync(LoginDto dto)
        {
            var user = await context.Users.Where(c=> c.Email == dto.Email).FirstOrDefaultAsync();

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException();

            return new AuthResponse(
                jwtService.GenerateToken(user),
                user.FullName
            );
        }
    }
}
