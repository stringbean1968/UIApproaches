namespace DragDropSortableJSExample.Models;

public class WorkItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Assignee { get; set; } = string.Empty;
    public WorkItemPriority Priority { get; set; } = WorkItemPriority.Medium;
}

public enum WorkItemPriority
{
    Low,
    Medium,
    High
}
