using InventoryManagement.Backend.DTOs;

namespace InventoryManagement.Backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
