namespace InventoryManagement.Backend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ImageUrl { get; set; }

        // Navigation properties
        public Category Category { get; set; } = null!;
        public ICollection<StockHistory> StockHistories { get; set; } = new List<StockHistory>();
    }
}
