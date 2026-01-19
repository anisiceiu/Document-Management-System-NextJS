using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace DMS.Api.DTOs
{
    public record LoginDto(string Email, string Password);
    public record RegisterDto(string FullName, string Email, string Password);
    public record AuthResponse(string Token, string FullName);
}
