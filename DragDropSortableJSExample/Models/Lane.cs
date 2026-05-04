namespace DragDropSortableJSExample.Models;

public class Lane
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public List<WorkItem> Items { get; set; } = new();
}
