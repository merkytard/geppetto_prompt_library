
document.addEventListener("DOMContentLoaded", () => {
    const nodeContainer = document.getElementById("nodeContainer");
    if (!nodeContainer) return; // Skontroluj, či existuje

    document.getElementById("addNode")?.addEventListener("click", () => createNode("New Node"));
});

function makeDraggable(node) {
    if (!node) return; // Ak node neexistuje, funkcia sa neprevedie

    node.addEventListener("mousedown", function (event) {
        event.preventDefault();
        draggingNode = node;
        let rect = node.getBoundingClientRect();
        let containerRect = document.getElementById("nodeContainer")?.getBoundingClientRect();
        if (!containerRect) return; // Skontroluj, či existuje nodeContainer

        let offsetX = event.clientX - rect.left;
        let offsetY = event.clientY - rect.top;

        function moveNode(event) {
            let newX = event.clientX - containerRect.left - offsetX;
            let newY = event.clientY - containerRect.top - offsetY;

            draggingNode.style.left = `${newX}px`;
            draggingNode.style.top = `${newY}px`;

            updateConnections();
        }

        function stopNodeDrag() {
            document.removeEventListener("mousemove", moveNode);
            document.removeEventListener("mouseup", stopNodeDrag);
            draggingNode = null;
        }

        document.addEventListener("mousemove", moveNode);
        document.addEventListener("mouseup", stopNodeDrag);
    });
}
