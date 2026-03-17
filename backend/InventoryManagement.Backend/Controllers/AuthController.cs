using InventoryManagement.Backend.DTOs;
using InventoryManagement.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            Console.WriteLine($"Login attempt for: {loginDto.Email}");
            var response = await _authService.LoginAsync(loginDto);
            if (response == null)
            {
                Console.WriteLine($"Login failed for: {loginDto.Email}");
                return Unauthorized(new { message = "Invalid email or password" });
            }

            Console.WriteLine($"Login successful for: {loginDto.Email}");
            return Ok(response);
        }
    }
}
