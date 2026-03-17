using InventoryManagement.Backend.DTOs;
using InventoryManagement.Backend.Models;
using InventoryManagement.Backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Backend.Services
{
    public class StockService : IStockService
    {
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<StockHistory> _stockHistoryRepository;

        public StockService(IRepository<Product> productRepository, IRepository<StockHistory> stockHistoryRepository)
        {
            _productRepository = productRepository;
            _stockHistoryRepository = stockHistoryRepository;
        }

        public async Task<bool> AddStockAsync(AddStockDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null || dto.Quantity <= 0) return false;

            product.Quantity += dto.Quantity;
            await _productRepository.UpdateAsync(product);

            var history = new StockHistory
            {
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                Type = "Add",
                Date = DateTime.UtcNow
            };
            await _stockHistoryRepository.AddAsync(history);

            return true;
        }

        public async Task<bool> RemoveStockAsync(RemoveStockDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null || product.Quantity < dto.Quantity || dto.Quantity <= 0) return false;

            product.Quantity -= dto.Quantity;
            await _productRepository.UpdateAsync(product);

            var history = new StockHistory
            {
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                Type = "Remove",
                Date = DateTime.UtcNow
            };
            await _stockHistoryRepository.AddAsync(history);

            return true;
        }

        public async Task<IEnumerable<ProductDto>> GetLowStockProductsAsync(int threshold = 10)
        {
            var products = await _productRepository.Query()
                .Include(p => p.Category)
                .Where(p => p.Quantity <= threshold)
                .ToListAsync();

            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Quantity = p.Quantity,
                CategoryId = p.CategoryId,
                Category = p.Category != null ? new CategoryDto { Id = p.Category.Id, Name = p.Category.Name, Description = p.Category.Description, Status = p.Category.Status, CreatedAt = p.Category.CreatedAt } : null
            });
        }
    }
}
