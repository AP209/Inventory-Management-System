namespace InventoryManagement.Backend.Models
{
    public class StockHistory
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string Type { get; set; } = string.Empty; // "Add" or "Remove"
        public DateTime Date { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Product Product { get; set; } = null!;
    }
}
