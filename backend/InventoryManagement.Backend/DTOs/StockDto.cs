namespace InventoryManagement.Backend.DTOs
{
    public class AddStockDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class RemoveStockDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
