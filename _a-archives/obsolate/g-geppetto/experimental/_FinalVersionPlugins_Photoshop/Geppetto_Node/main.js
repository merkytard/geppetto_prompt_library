document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addNode").addEventListener("click", () => createNode(`Node ${document.querySelectorAll(".node").length + 1}`));
    document.getElementById("addOutputNode").addEventListener("click", () => createNode(`Group/Container`, 400, 400, true));
});

let nodes = [];
let connections = [];
let startNode = null;
let tempConnection = null;

// 📌 Vytvorenie nodu (s output možnosťou)
function createNode(name, x = 150, y = 150, isOutput = false) {
    const nodeContainer = document.getElementById("nodeContainer");

    const nodeId = `node${nodes.length + 1}`;
    const node = document.createElement("div");
    node.className = `node ${isOutput ? 'output-node' : ''}`;
    node.dataset.nodeId = nodeId;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    const title = document.createElement("div");
    title.className = "node-title";
    title.textContent = name;
    title.contentEditable = "true"; // ✨ Možnosť premenovať uzol
    title.addEventListener("input", () => updateNodeTitle(nodeId, title.textContent));

    const expandBtn = document.createElement("button");
    expandBtn.textContent = "[ Expand Settings ]";
    expandBtn.className = "expand-btn";
    expandBtn.addEventListener("click", () => node.classList.toggle("open"));

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.className = "remove-node";
    removeBtn.addEventListener("click", () => removeNode(nodeId));

    const inputPort = document.createElement("div");
    inputPort.className = "node-port input-port";
    inputPort.textContent = "◀";
    inputPort.dataset.nodeId = nodeId;
    inputPort.dataset.portType = "input";
    inputPort.addEventListener("mousedown", (e) => startConnection(e, nodeId, "input"));

    const outputPort = document.createElement("div");
    outputPort.className = "node-port output-port";
    outputPort.textContent = "▶";
    outputPort.dataset.nodeId = nodeId;
    outputPort.dataset.portType = "output";
    outputPort.addEventListener("mousedown", (e) => startConnection(e, nodeId, "output"));

    const settingsPanel = document.createElement("div");
    settingsPanel.className = "node-body";
    settingsPanel.innerHTML = `
        <label>Type:</label>
        <select class="node-type">
            <option value="Container">Container</option>
            <option value="Folder">Folder</option>
            <option value="Group">Group</option>
        </select>
        <label>Opacity:</label>
        <input type="range" min="0" max="100" value="100" class="opacity-slider">
        <label>Blend Mode:</label>
        <select class="blend-mode">
            <option value="Normal">Normal</option>
            <option value="Multiply">Multiply</option>
            <option value="Screen">Screen</option>
            <option value="Overlay">Overlay</option>
        </select>
    `;

    node.appendChild(removeBtn);
    node.appendChild(title);
    node.appendChild(expandBtn);
    node.appendChild(settingsPanel);
    node.appendChild(inputPort);
    node.appendChild(outputPort);
    nodeContainer.appendChild(node);

    makeNodeDraggable(node);
    nodes.push({ id: nodeId, element: node });
}

// 📌 Povolenie drag & drop pre nody
function makeNodeDraggable(node) {
    node.addEventListener("mousedown", function (event) {
        if (event.target.classList.contains("node-port")) return; // Porty nesmú spustiť ťahanie

        let offsetX = event.clientX - node.offsetLeft;
        let offsetY = event.clientY - node.offsetTop;

        function moveNode(event) {
            node.style.left = `${event.clientX - offsetX}px`;
            node.style.top = `${event.clientY - offsetY}px`;
            updateConnections();
        }

        function stopNodeDrag() {
            document.removeEventListener("mousemove", moveNode);
            document.removeEventListener("mouseup", stopNodeDrag);
        }

        document.addEventListener("mousemove", moveNode);
        document.addEventListener("mouseup", stopNodeDrag);
    });

    node.ondragstart = () => false;
}

// 📌 Začiatok prepojenia nodov
function startConnection(event, nodeId, portType) {
    event.stopPropagation();

    if (!tempConnection) {
        startNode = { nodeId, portType };
        tempConnection = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempConnection.setAttribute("stroke", "#E3E3E3");
        tempConnection.setAttribute("stroke-width", "2");
        tempConnection.setAttribute("fill", "none");
        tempConnection.setAttribute("stroke-linecap", "round");
        document.getElementById("svgCanvas").appendChild(tempConnection);
    } else {
        let endNode = { nodeId, portType };
        if (startNode.nodeId !== endNode.nodeId && startNode.portType !== endNode.portType) {
            connections.push({ from: startNode.nodeId, to: endNode.nodeId });
            updateConnections();
        }
        tempConnection.remove();
        tempConnection = null;
        startNode = null;
    }
}

// 📌 Aktualizácia spojení medzi nodmi
function updateConnections() {
    let svgCanvas = document.getElementById("svgCanvas");
    svgCanvas.innerHTML = ""; // Vyčistiť existujúce linky

    connections.forEach(({ from, to }) => {
        let startNode = document.querySelector(`[data-node-id="${from}"]`);
        let endNode = document.querySelector(`[data-node-id="${to}"]`);
        if (!startNode || !endNode) return;

        let startRect = startNode.getBoundingClientRect();
        let endRect = endNode.getBoundingClientRect();
        let containerRect = document.getElementById("nodeContainer").getBoundingClientRect();

        let startX = startRect.right - containerRect.left;
        let startY = startRect.top + startRect.height / 2 - containerRect.top;
        let endX = endRect.left - containerRect.left;
        let endY = endRect.top + endRect.height / 2 - containerRect.top;

        const deltaX = (endX - startX) * 0.5;
        let curvePath = `M${startX},${startY} C${startX + deltaX},${startY} ${endX - deltaX},${endY} ${endX},${endY}`;

        let wire = document.createElementNS("http://www.w3.org/2000/svg", "path");
        wire.setAttribute("d", curvePath);
        wire.setAttribute("stroke", "rgb(185, 186, 189)");
        wire.setAttribute("stroke-width", "3");
        wire.setAttribute("fill", "none");
        wire.setAttribute("stroke-linecap", "round");

        svgCanvas.appendChild(wire);
    });
}

// 📌 Odstránenie uzla + prepojení
function removeNode(nodeId) {
    let node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (node) node.remove();

    connections = connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId);
    updateConnections();
}

// 📌 Zmena názvu nodu
function updateNodeTitle(nodeId, newName) {
    let node = nodes.find(n => n.id === nodeId);
    if (node) node.element.querySelector(".node-title").textContent = newName;
}
