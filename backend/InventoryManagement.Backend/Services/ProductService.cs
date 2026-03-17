using InventoryManagement.Backend.DTOs;
using InventoryManagement.Backend.Models;
using InventoryManagement.Backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<Category> _categoryRepository;

        public ProductService(IRepository<Product> productRepository, IRepository<Category> categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.Query().Include(p => p.Category).ToListAsync();
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Quantity = p.Quantity,
                CategoryId = p.CategoryId,
                ImageUrl = p.ImageUrl,
                Category = p.Category != null ? new CategoryDto { Id = p.Category.Id, Name = p.Category.Name, Description = p.Category.Description, Status = p.Category.Status, CreatedAt = p.Category.CreatedAt } : null
            });
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.Query().Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null;

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Quantity = product.Quantity,
                CategoryId = product.CategoryId,
                ImageUrl = product.ImageUrl,
                Category = product.Category != null ? new CategoryDto { Id = product.Category.Id, Name = product.Category.Name, Description = product.Category.Description, Status = product.Category.Status, CreatedAt = product.Category.CreatedAt } : null
            };
        }

        public async Task<ProductDto?> CreateProductAsync(CreateProductDto createDto)
        {
            var category = await _categoryRepository.GetByIdAsync(createDto.CategoryId);
            if (category == null) return null;

            var product = new Product
            {
                Name = createDto.Name,
                Price = createDto.Price,
                Quantity = createDto.Quantity,
                CategoryId = createDto.CategoryId,
                ImageUrl = createDto.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            await _productRepository.AddAsync(product);

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Quantity = product.Quantity,
                CategoryId = product.CategoryId,
                ImageUrl = product.ImageUrl,
                Category = new CategoryDto { Id = category.Id, Name = category.Name, Description = category.Description, Status = category.Status, CreatedAt = category.CreatedAt }
            };
        }

        public async Task<bool> UpdateProductAsync(int id, UpdateProductDto updateDto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return false;

            var category = await _categoryRepository.GetByIdAsync(updateDto.CategoryId);
            if (category == null) return false;

            product.Name = updateDto.Name;
            product.Price = updateDto.Price;
            product.Quantity = updateDto.Quantity;
            product.CategoryId = updateDto.CategoryId;
            product.ImageUrl = updateDto.ImageUrl;

            await _productRepository.UpdateAsync(product);
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null) return false;

            await _productRepository.DeleteAsync(product);
            return true;
        }
    }
}
