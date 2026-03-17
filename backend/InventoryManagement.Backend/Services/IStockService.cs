using InventoryManagement.Backend.DTOs;

namespace InventoryManagement.Backend.Services
{
    public interface IStockService
    {
        Task<bool> AddStockAsync(AddStockDto dto);
        Task<bool> RemoveStockAsync(RemoveStockDto dto);
        Task<IEnumerable<ProductDto>> GetLowStockProductsAsync(int threshold = 10);
    }
}
