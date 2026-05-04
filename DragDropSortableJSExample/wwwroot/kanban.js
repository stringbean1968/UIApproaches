window.kanban = (() => {
    const sortableInstances = {};

    /**
     * Initializes SortableJS on all lane containers.
     * @param {object} dotNetRef - DotNetObjectReference to call back into .NET
     * @param {string[]} laneIds - Array of lane element IDs to initialize
     */
    function initialize(dotNetRef, laneIds) {
        dispose();

        laneIds.forEach(laneId => {
            const el = document.getElementById(laneId);
            if (!el) return;

            sortableInstances[laneId] = Sortable.create(el, {
                group: 'kanban-board',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onEnd: function (evt) {
                    const itemId = evt.item.getAttribute('data-item-id');
                    const fromLaneId = evt.from.id;
                    const toLaneId = evt.to.id;
                    const newIndex = evt.newDraggableIndex;

                    dotNetRef.invokeMethodAsync('OnItemDropped', itemId, fromLaneId, toLaneId, newIndex);
                }
            });
        });
    }

    /**
     * Destroys all Sortable instances to prevent memory leaks.
     */
    function dispose() {
        Object.keys(sortableInstances).forEach(id => {
            if (sortableInstances[id]) {
                sortableInstances[id].destroy();
                delete sortableInstances[id];
            }
        });
    }

    return { initialize, dispose };
})();
