using InventoryManagement.Backend.DTOs;

namespace InventoryManagement.Backend.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto?> CreateProductAsync(CreateProductDto createDto);
        Task<bool> UpdateProductAsync(int id, UpdateProductDto updateDto);
        Task<bool> DeleteProductAsync(int id);
    }
}
