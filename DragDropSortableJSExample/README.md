# Drag & Drop Sortable JS Example

A Blazor WebAssembly demo showing a **Jira/Trello-style Kanban board** with drag-and-drop of work items between workflow state columns, powered by [SortableJS](https://sortablejs.github.io/Sortable/) via Blazor JS Interop.

## Features

- Drag cards **within a lane** to reorder them
- Drag cards **across lanes** (including across columns) to change their workflow state
- **Split columns** — the *In Progress* column contains two sub-lanes (*Doing* and *Review*) to demonstrate Jira-style column splitting
- Priority colour coding (High/Medium/Low)
- Live status message showing the last move

## Setup & Running

Prerequisites: [.NET SDK](https://dotnet.microsoft.com/download) (version 10 or later)

```bash
git clone https://github.com/stringbean1968/UIApproaches.git
cd UIApproaches/DragDropSortableJSExample
dotnet run
```

Open your browser to `https://localhost:PORT` (shown in the terminal output) and navigate to **Kanban Board** in the sidebar.

> **Note:** SortableJS is loaded from jsDelivr CDN — an internet connection is required on first load.

## Project Structure

```
DragDropSortableJSExample/
├── Models/
│   ├── WorkItem.cs       # Work item (id, title, description, assignee, priority)
│   ├── Lane.cs           # Drop-zone inside a column; holds a list of WorkItems
│   └── BoardColumn.cs    # Logical workflow state; holds one or more Lanes
├── Pages/
│   ├── KanbanBoard.razor     # Board page with SortableJS wiring and .NET drop handler
│   └── KanbanBoard.razor.css # Scoped CSS for the board UI
├── wwwroot/
│   ├── kanban.js         # JS: initializes Sortable on lane elements; calls back into .NET on drop
│   └── index.html        # Adds SortableJS CDN + kanban.js script references
└── Layout/
    └── NavMenu.razor     # Sidebar nav — Kanban Board link added
```

## Architecture & How It Works

### Data model

```
BoardColumn  (e.g. "In Progress")
  └── Lane[]  (e.g. "Doing", "Review")
        └── WorkItem[]
```

Each `Lane` has a stable string `Id` (e.g. `"lane-doing"`) that becomes the DOM element `id` for its drop zone.

### Drag & drop flow

1. `KanbanBoard.razor` renders each lane as `<div class="kanban-lane" id="@lane.Id">`.
2. After the first render, `OnAfterRenderAsync` calls `kanban.initialize(dotNetRef, laneIds[])` via JS Interop.
3. `kanban.js` creates a `Sortable` instance for every lane, all sharing `group: "kanban-board"` so cards can move between lanes.
4. On drop, the `onEnd` callback calls `dotNetRef.invokeMethodAsync("OnItemDropped", itemId, fromLaneId, toLaneId, newIndex)`.
5. The `[JSInvokable] OnItemDropped` method in C# removes the card from the source lane, inserts it at `newIndex` in the destination lane, then re-initialises Sortable for the updated DOM.
6. On component disposal, `kanban.dispose()` tears down all Sortable instances to prevent memory leaks.

## Adding More Columns / Lanes

Edit `BuildInitialBoard()` in `KanbanBoard.razor`. Add a new `BoardColumn` with one or more `Lane` objects and populate `Items` with `WorkItem` instances. The board will render and wire up automatically.

## Extending

- **Persistence** — replace the in-memory list updates with API calls in `OnItemDropped`.
- **Real swimlanes** (rows per assignee/team) — wrap the existing column layout in an outer row loop.
- **Drag handles** — add `handle: ".drag-handle"` to the Sortable options in `kanban.js` and add a handle element to the card markup.
- **WIP limits** — check `toLane.Items.Count` in `OnItemDropped` and reject/revert if over limit.