namespace DragDropSortableJSExample.Models;

public class BoardColumn
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public List<Lane> Lanes { get; set; } = new();
}
