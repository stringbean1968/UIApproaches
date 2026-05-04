# Drag and Drop Sortable JS Example

This project demonstrates a Jira/Trello-style drag and drop board using SortableJS with JS interop in a Blazor WebAssembly app.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/stringbean1968/UIApproaches.git
   cd UIApproaches/DragDropSortableJSExample
   ```
2. Restore the project dependencies:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```

## Adding Split Columns

To add split columns, you can add multiple lanes under a column, allowing for parallel task management within that column. Adjust the layout in the UI component accordingly to display these lanes distinctly.

## Project Structure
- `wwwroot/kanban.js`: Initializes SortableJS on lane elements and handles drop callbacks to .NET.
- `Models/Column.cs`: Defines the structure of a column.
- `Models/Lane.cs`: Defines the structure of a lane.
- `Models/WorkItem.cs`: Defines the structure of a work item.
- `State/StateManagement.cs`: Contains in-memory state management logic for lanes and items.