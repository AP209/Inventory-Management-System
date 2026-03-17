using InventoryManagement.Backend.DTOs;
using InventoryManagement.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryManagement.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
        {
            _stockService = stockService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddStock([FromBody] AddStockDto dto)
        {
            var success = await _stockService.AddStockAsync(dto);
            if (!success) return BadRequest(new { message = "Invalid product Id or quantity" });
            
            return Ok(new { message = "Stock added successfully" });
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveStock([FromBody] RemoveStockDto dto)
        {
            var success = await _stockService.RemoveStockAsync(dto);
            if (!success) return BadRequest(new { message = "Invalid product Id, quantity, or insufficient stock" });

            return Ok(new { message = "Stock removed successfully" });
        }

        [HttpGet("~/api/products/lowstock")]
        public async Task<IActionResult> GetLowStockProducts([FromQuery] int threshold = 10)
        {
            var products = await _stockService.GetLowStockProductsAsync(threshold);
            return Ok(products);
        }
    }
}
