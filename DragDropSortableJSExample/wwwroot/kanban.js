window.kanban = (() => {
    const sortableInstances = {};

    // ── Horizontal autoscroll state ──────────────────────────────────────────
    let scrollContainer = null;
    let isDragging = false;
    let lastPointerX = 0;
    let autoScrollRaf = null;

    const SCROLL_EDGE = 80;  // px from edge that triggers autoscroll
    const SCROLL_MAX  = 14;  // max px scrolled per animation frame

    function onPointerMove(e) {
        lastPointerX = e.clientX;
    }

    function autoScrollStep() {
        if (!isDragging || !scrollContainer) {
            autoScrollRaf = null;
            return;
        }
        const rect = scrollContainer.getBoundingClientRect();
        const x = lastPointerX;
        if (x < rect.left + SCROLL_EDGE) {
            const t = Math.max(0, 1 - (x - rect.left) / SCROLL_EDGE);
            scrollContainer.scrollLeft -= Math.ceil(SCROLL_MAX * t);
        } else if (x > rect.right - SCROLL_EDGE) {
            const t = Math.max(0, 1 - (rect.right - x) / SCROLL_EDGE);
            scrollContainer.scrollLeft += Math.ceil(SCROLL_MAX * t);
        }
        autoScrollRaf = requestAnimationFrame(autoScrollStep);
    }

    function startAutoScroll() {
        isDragging = true;
        document.addEventListener('pointermove', onPointerMove);
        autoScrollRaf = requestAnimationFrame(autoScrollStep);
    }

    function stopAutoScroll() {
        isDragging = false;
        document.removeEventListener('pointermove', onPointerMove);
        if (autoScrollRaf !== null) {
            cancelAnimationFrame(autoScrollRaf);
            autoScrollRaf = null;
        }
    }

    // ── SortableJS management ────────────────────────────────────────────────

    /**
     * Initializes SortableJS on all lane containers.
     * @param {object} dotNetRef       - DotNetObjectReference to call back into .NET
     * @param {string[]} laneIds       - Array of lane element IDs to initialize
     * @param {string} [scrollContainerId] - ID of the horizontal scroll wrapper (for autoscroll)
     */
    function initialize(dotNetRef, laneIds, scrollContainerId) {
        // Never reinitialize while a drag is in progress — it would tear down the active Sortable
        if (isDragging) return;

        dispose();

        scrollContainer = scrollContainerId
            ? document.getElementById(scrollContainerId)
            : null;

        laneIds.forEach(laneId => {
            const el = document.getElementById(laneId);
            if (!el) return;

            sortableInstances[laneId] = Sortable.create(el, {
                group: 'kanban-board',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',

                onStart: function () {
                    startAutoScroll();
                },

                // Fires when a card is dropped into a DIFFERENT lane
                onAdd: function (evt) {
                    const itemId    = evt.item.dataset.itemId;
                    const fromLaneId = evt.from.id;
                    const toLaneId   = evt.to.id;
                    const newIndex   = evt.newDraggableIndex ?? 0;
                    dotNetRef.invokeMethodAsync('OnItemDropped', itemId, fromLaneId, toLaneId, newIndex);
                },

                // Fires when a card is reordered WITHIN the same lane
                onUpdate: function (evt) {
                    const itemId  = evt.item.dataset.itemId;
                    const laneId  = evt.to.id;
                    const newIndex = evt.newDraggableIndex ?? 0;
                    dotNetRef.invokeMethodAsync('OnItemDropped', itemId, laneId, laneId, newIndex);
                },

                onEnd: function () {
                    stopAutoScroll();
                }
            });
        });
    }

    /**
     * Destroys all Sortable instances to prevent memory leaks.
     */
    function dispose() {
        stopAutoScroll();
        Object.keys(sortableInstances).forEach(id => {
            if (sortableInstances[id]) {
                sortableInstances[id].destroy();
                delete sortableInstances[id];
            }
        });
    }

    return { initialize, dispose };
})();
