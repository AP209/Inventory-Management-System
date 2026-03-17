using InventoryManagement.Backend.DTOs;
using InventoryManagement.Backend.Models;
using InventoryManagement.Backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Category> _categoryRepository;

        public CategoryService(IRepository<Category> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Status = c.Status,
                CreatedAt = c.CreatedAt
            });
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                CreatedAt = category.CreatedAt
            };
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto)
        {
            var category = new Category
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Status = createDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            await _categoryRepository.AddAsync(category);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Status = category.Status,
                CreatedAt = category.CreatedAt
            };
        }

        public async Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto updateDto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return false;

            category.Name = updateDto.Name;
            category.Description = updateDto.Description;
            category.Status = updateDto.Status;

            await _categoryRepository.UpdateAsync(category);
            return true;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return false;

            await _categoryRepository.DeleteAsync(category);
            return true;
        }
    }
}
