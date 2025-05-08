const { app, action, core } = require("photoshop");
const batchPlay = action.batchPlay;
const executeAsModal = core.executeAsModal;

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Global variables
let collapseStates = {};         // Stav collapse pre vrstvy/skupiny (key: layer id)
let selectedLayers = new Set();
let selectedContainer = "UI";      // Predvolený kontajner pre nové vrstvy
let isDragging = false;          // Flag pre drag & drop
let isRenaming = false;          // Flag pre inline renaming
let lastInteractionTime = Date.now();
const userInteractionThreshold = 1000; // 1 sekunda

// Global connections for wiring (stub)
let connections = [];

// Wiring variables – deklarované len raz
let wiringActive = false;
let wiringStartPort = null; // Port element, odkiaľ začína prepájanie
let wiringStartNode = null; // Node id, odkiaľ začína prepájanie
let activeWire = null;      // Dočasná SVG čiara pre wiring

// Update last interaction time
document.addEventListener("mousedown", () => { lastInteractionTime = Date.now(); });
document.addEventListener("keydown", () => { lastInteractionTime = Date.now(); });
document.addEventListener("touchstart", () => { lastInteractionTime = Date.now(); });

/* ===== CONTAINERS ===== */
function initializeContainerHeaders() {
  document.querySelectorAll(".layer-group.fixed h3").forEach(header => {
    if (header.querySelector(".group-toggle") && header.querySelector(".group-title")) return;
    const text = header.textContent.trim();
    header.textContent = "";
    const toggleSpan = document.createElement("span");
    toggleSpan.className = "group-toggle";
    toggleSpan.textContent = "▼";
    toggleSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleContainer(header.parentElement);
    });
    const titleSpan = document.createElement("span");
    titleSpan.className = "group-title";
    titleSpan.textContent = text;
    titleSpan.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      startRenameContainer(titleSpan, header);
    });
    header.appendChild(toggleSpan);
    header.appendChild(document.createTextNode(" "));
    header.appendChild(titleSpan);
    header.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedContainer = header.parentElement.dataset.container;
      console.log("Selected container:", selectedContainer);
    });
  });
}

function toggleContainer(container) {
  const content = container.querySelector("div[id$='Layers']");
  if (content) {
    if (content.style.display === "none") {
      content.style.display = "block";
      const toggle = container.querySelector("h3 .group-toggle");
      if (toggle) toggle.textContent = "▼";
    } else {
      content.style.display = "none";
      const toggle = container.querySelector("h3 .group-toggle");
      if (toggle) toggle.textContent = "►";
    }
  }
}

function startRenameContainer(titleSpan, header) {
  if (isRenaming) return;
  isRenaming = true;
  const currentName = titleSpan.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentName;
  input.className = "rename-input";
  titleSpan.replaceWith(input);
  input.focus();
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      await finishRenameContainer(input, header);
      isRenaming = false;
    }
  });
  input.addEventListener("blur", async () => {
    await finishRenameContainer(input, header);
    isRenaming = false;
  });
}

async function finishRenameContainer(input, header) {
  let newName = input.value.trim();
  if (newName === "") newName = "Container";
  const titleSpan = document.createElement("span");
  titleSpan.className = "group-title";
  titleSpan.textContent = newName;
  input.replaceWith(titleSpan);
  titleSpan.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    startRenameContainer(titleSpan, header);
  });
  console.log(`Container renamed to ${newName}`);
}

/* ===== LAYERS & GROUPS ===== */
function getLayerGroup(layerName) {
  if (layerName === "UI" || layerName === "GA" || layerName === "BG") return layerName;
  if (layerName.startsWith("UI_")) return "UI";
  if (layerName.startsWith("GA_")) return "GA";
  if (layerName.startsWith("BG_")) return "BG";
  return "BG";
}

async function getPhotoshopLayers() {
  function traverse(layers) {
    let result = [];
    layers.forEach(layer => {
      if (layer.kind === "group" && (layer.name === "UI" || layer.name === "GA" || layer.name === "BG")) {
        result = result.concat(traverse(layer.layers));
      } else {
        const obj = {
          id: layer.id,
          name: layer.name,
          kind: layer.kind,
          children: layer.layers ? traverse(layer.layers) : []
        };
        obj.group = getLayerGroup(obj.name);
        result.push(obj);
      }
    });
    return result;
  }
  return traverse(app.activeDocument.layers);
}

function createLayerElement(layer) {
  const div = document.createElement("div");
  div.className = "layer";
  div.dataset.layerId = layer.id;
  
  if (layer.children && layer.children.length > 0) {
    const toggle = document.createElement("span");
    toggle.className = "expand-toggle";
    const isCollapsed = (collapseStates[layer.id] === undefined ? true : collapseStates[layer.id]);
    toggle.textContent = isCollapsed ? "►" : "▼";
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const childrenContainer = div.querySelector(".layer-children");
      if (childrenContainer) {
        if (childrenContainer.style.display === "none") {
          childrenContainer.style.display = "block";
          toggle.textContent = "▼";
          collapseStates[layer.id] = false;
        } else {
          childrenContainer.style.display = "none";
          toggle.textContent = "►";
          collapseStates[layer.id] = true;
        }
      }
    });
    div.appendChild(toggle);
  } else {
    const spacer = document.createElement("span");
    spacer.style.display = "inline-block";
    spacer.style.width = "18px";
    div.appendChild(spacer);
  }
  
  const icon = document.createElement("span");
  icon.classList.add("layer-icon");
  if (layer.kind === "textLayer") {
    icon.textContent = "🔤";
  } else if (layer.kind === "smartObject") {
    icon.textContent = "🧩";
  } else {
    icon.textContent = "🖼";
  }
  div.appendChild(icon);
  
  const nameSpan = document.createElement("span");
  nameSpan.className = "layer-name";
  nameSpan.textContent = layer.name;
  nameSpan.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    startRenameLayer(layer, nameSpan);
  });
  div.appendChild(nameSpan);
  
  div.addEventListener("click", (event) => {
    event.stopPropagation();
    selectLayer(event, div, layer.id);
  });
  
  div.draggable = true;
  div.addEventListener("dragstart", (event) => {
    isDragging = true;
    event.dataTransfer.setData("text/plain", layer.id);
  });
  div.addEventListener("dragend", () => { isDragging = false; });
  div.addEventListener("dragover", (event) => { event.preventDefault(); });
  div.addEventListener("drop", async (event) => {
    event.preventDefault();
    const draggedLayerId = event.dataTransfer.getData("text/plain");
    const rect = div.getBoundingClientRect();
    const dropPosition = (event.clientY - rect.top) < rect.height / 2 ? "above" : "below";
    await reorderLayer(draggedLayerId, layer.id, dropPosition);
    await updateLayers();
  });
  
  if (layer.children && layer.children.length > 0) {
    const childrenContainer = document.createElement("div");
    childrenContainer.className = "layer-children";
    const isCollapsed = (collapseStates[layer.id] === undefined ? true : collapseStates[layer.id]);
    childrenContainer.style.display = isCollapsed ? "none" : "block";
    layer.children.forEach(child => {
      const childElement = createLayerElement(child);
      childrenContainer.appendChild(childElement);
    });
    div.appendChild(childrenContainer);
  }
  
  if (selectedLayers.has(layer.id)) {
    div.classList.add("selected");
  }
  return div;
}

function selectLayer(event, layerElement, layerId) {
  if (event.ctrlKey || event.shiftKey) {
    if (selectedLayers.has(layerId)) {
      selectedLayers.delete(layerId);
    } else {
      selectedLayers.add(layerId);
    }
  } else {
    selectedLayers.clear();
    selectedLayers.add(layerId);
  }
  updateLayerSelection();
}

function updateLayerSelection() {
  document.querySelectorAll(".layer").forEach(layer => {
    const id = layer.dataset.layerId;
    if (selectedLayers.has(id)) {
      layer.classList.add("selected");
    } else {
      layer.classList.remove("selected");
    }
  });
  console.log("Selected layers:", Array.from(selectedLayers));
}

function startRenameLayer(layer, nameSpan) {
  if (isRenaming) return;
  isRenaming = true;
  const currentName = layer.name;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentName;
  input.className = "rename-input";
  nameSpan.replaceWith(input);
  input.focus();
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      await finishRenameLayer(layer, input);
      isRenaming = false;
    }
  });
  input.addEventListener("blur", async () => {
    await finishRenameLayer(layer, input);
    isRenaming = false;
  });
}

async function finishRenameLayer(layer, input) {
  const newName = input.value.trim();
  if (newName && newName !== layer.name) {
    await renameLayer(layer.id, newName);
    layer.name = newName;
  }
  const nameSpan = document.createElement("span");
  nameSpan.className = "layer-name";
  nameSpan.textContent = layer.name;
  nameSpan.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    startRenameLayer(layer, nameSpan);
  });
  input.replaceWith(nameSpan);
}

async function renameLayer(layerId, newName) {
  await executeAsModal(async () => {
    await batchPlay([{
      _obj: "set",
      _target: [{ _ref: "layer", _id: layerId }],
      to: { name: newName }
    }], { synchronousExecution: true });
  }, { commandName: "Rename Layer" });
  console.log(`Renamed layer ${layerId} to ${newName}`);
}

async function reorderLayer(draggedLayerId, targetLayerId, position) {
  console.log(`Reorder: Move layer ${draggedLayerId} ${position} layer ${targetLayerId} - (logic to be implemented)`);
  // Implement reordering logic using batchPlay if needed.
}

/* ===== NODE TREE VISUALIZATION ===== */
// Wiring functions for interactive cabling
function startWiring(e, node, portType) {
  e.stopPropagation();
  wiringActive = true;
  wiringStartNode = node.dataset.nodeId;
  wiringStartPort = e.target;
  
  activeWire = document.createElementNS("http://www.w3.org/2000/svg", "line");
  activeWire.setAttribute("stroke", "#E3E3E3");
  activeWire.setAttribute("stroke-width", "2");
  
  const svgCanvas = document.getElementById("svgCanvas");
  if (svgCanvas) {
    svgCanvas.appendChild(activeWire);
  }
  
  document.addEventListener("mousemove", updateWiringLine);
  document.addEventListener("mouseup", endWiring);
}

function updateWiringLine(e) {
  if (!wiringActive || !activeWire || !wiringStartPort) return;
  const modal = document.getElementById("nodeModal");
  if (!modal) return;
  const modalRect = modal.getBoundingClientRect();
  const startRect = wiringStartPort.getBoundingClientRect();
  if (!startRect) return;
  const startX = startRect.right - modalRect.left;
  const startY = startRect.top + startRect.height / 2 - modalRect.top;
  const currentX = e.clientX - modalRect.left;
  const currentY = e.clientY - modalRect.top;
  activeWire.setAttribute("x1", startX);
  activeWire.setAttribute("y1", startY);
  activeWire.setAttribute("x2", currentX);
  activeWire.setAttribute("y2", currentY);
}

function endWiring(e) {
  if (!wiringActive) return;
  // Použijeme e.target ako fallback
  const target = e.target;
  if (target && target.classList.contains("node-port") && target.classList.contains("input-port")) {
    const inputNode = target.closest("[data-node-id]");
    if (inputNode) {
      const targetNodeId = inputNode.dataset.nodeId;
      console.log(`Wiring complete: ${wiringStartNode} -> ${targetNodeId}`);
      connections.push({ from: wiringStartNode, to: targetNodeId });
      renderNodeConnections();
    }
  }
  if (activeWire && activeWire.parentNode) {
    activeWire.parentNode.removeChild(activeWire);
  }
  wiringActive = false;
  wiringStartPort = null;
  wiringStartNode = null;
  activeWire = null;
  document.removeEventListener("mousemove", updateWiringLine);
  document.removeEventListener("mouseup", endWiring);
}

function attachPortEvents() {
  document.querySelectorAll(".node-port.output-port").forEach(port => {
    port.addEventListener("mousedown", (e) => {
      const nodeEl = port.closest("[data-node-id]");
      if (nodeEl) {
        startWiring(e, nodeEl, "output");
      } else {
        console.warn("Output port not within a node element");
      }
    });
  });
}

// Node tree layout: horizontálne = depth * 200, vertikálne podľa podstromu
function layoutNodes(nodes, depth = 0, startY = 0) {
  const verticalSpacing = 100;
  const horizontalSpacing = 200;
  let positioned = [];
  let currentY = startY;
  nodes.forEach(node => {
    let children = [];
    let subtreeHeight = verticalSpacing;
    if (node.children && node.children.length > 0) {
      children = layoutNodes(node.children, depth + 1, currentY);
      subtreeHeight = children.reduce((max, child) => Math.max(max, child.y), currentY) - currentY + verticalSpacing;
    }
    const nodeY = currentY + subtreeHeight / 2;
    positioned.push({ ...node, x: depth * horizontalSpacing + 50, y: nodeY, children: children });
    currentY += subtreeHeight;
  });
  return positioned;
}

function renderPositionedNodeTree(container, positionedNodes) {
  let canvas = document.getElementById("nodeCanvas");
  if (!canvas) {
    canvas = document.createElement("div");
    canvas.id = "nodeCanvas";
    canvas.style.position = "relative";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
  }
  canvas.innerHTML = "";
  positionedNodes.forEach(node => {
    const nodeDiv = createPositionedNode(node);
    canvas.appendChild(nodeDiv);
  });
  attachPortEvents();
}

function renderNodeTree(modalContainer) {
  getPhotoshopLayers().then(layers => {
    const positioned = layoutNodes(layers);
    const existingTree = modalContainer.querySelector("#nodeCanvas");
    if (existingTree) { existingTree.remove(); }
    renderPositionedNodeTree(modalContainer, positioned);
  });
}

function createPositionedNode(node) {
  const div = document.createElement("div");
  div.className = "positioned-node";
  div.dataset.nodeId = node.id;
  div.style.position = "absolute";
  div.style.left = node.x + "px";
  div.style.top = node.y + "px";
  div.style.padding = "10px";
  div.style.border = "1px solid #555";
  div.style.borderRadius = "5px";
  div.style.background = "#3F464B";
  div.style.cursor = "move";
  
  const header = document.createElement("div");
  header.className = "node-header";
  
  const visibilityIcon = document.createElement("span");
  visibilityIcon.className = "node-visibility";
  visibilityIcon.textContent = "👁";
  header.appendChild(visibilityIcon);
  
  const inputPort = document.createElement("span");
  inputPort.className = "node-port input-port";
  inputPort.textContent = "I";
  header.appendChild(inputPort);
  
  const titleSpan = document.createElement("span");
  titleSpan.className = "node-title";
  titleSpan.textContent = node.name;
  header.appendChild(titleSpan);
  
  const outputPort = document.createElement("span");
  outputPort.className = "node-port output-port";
  outputPort.textContent = "O";
  header.appendChild(outputPort);
  
  const fxLabel = document.createElement("span");
  fxLabel.className = "node-fx";
  if (node.name.includes("FX")) {
    fxLabel.textContent = "FX";
    fxLabel.style.marginLeft = "5px";
    fxLabel.style.padding = "2px 4px";
    fxLabel.style.border = "1px solid #E3E3E3";
    fxLabel.style.borderRadius = "3px";
    fxLabel.style.fontSize = "0.8em";
  }
  header.appendChild(fxLabel);
  
  div.appendChild(header);
  
  div.draggable = true;
  div.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", node.id);
  });
  div.addEventListener("dragover", (e) => { e.preventDefault(); });
  div.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    console.log(`Positioned node drop: move node ${draggedId} under node ${node.id} - (stub)`);
    // Implement connection logic if needed.
  });
  
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const childDiv = createPositionedNode(child);
      div.appendChild(childDiv);
    });
  }
  
  div.onmousedown = (event) => startDrag(event, div);
  
  return div;
}

function startDrag(event, node) {
  event.preventDefault();
  let offsetX = event.clientX - node.getBoundingClientRect().left;
  let offsetY = event.clientY - node.getBoundingClientRect().top;
  
  function onMouseMove(e) {
    node.style.left = `${e.clientX - offsetX}px`;
    node.style.top = `${e.clientY - offsetY}px`;
    updateWires();
  }
  
  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    updateWires();
  }
  
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function updateWires() {
  let svgCanvas = document.getElementById("svgCanvas");
  if (!svgCanvas) return;
  svgCanvas.innerHTML = "";
  connections.forEach(conn => {
    let startNode = document.querySelector(`[data-node-id="${conn.from}"]`);
    let endNode = document.querySelector(`[data-node-id="${conn.to}"]`);
    if (!startNode || !endNode) return;
    let startRect = startNode.getBoundingClientRect();
    let endRect = endNode.getBoundingClientRect();
    let modal = document.getElementById("nodeModal");
    let modalRect = modal.getBoundingClientRect();
    let x1 = startRect.right - modalRect.left;
    let y1 = startRect.top + startRect.height / 2 - modalRect.top;
    let x2 = endRect.left - modalRect.left;
    let y2 = endRect.top + endRect.height / 2 - modalRect.top;
    let wire = document.createElementNS("http://www.w3.org/2000/svg", "line");
    wire.setAttribute("x1", x1);
    wire.setAttribute("y1", y1);
    wire.setAttribute("x2", x2);
    wire.setAttribute("y2", y2);
    wire.setAttribute("stroke", "#E3E3E3");
    wire.setAttribute("stroke-width", "2");
    svgCanvas.appendChild(wire);
  });
}

/* ===== NODE MODAL ===== */
function openNodeModal() {
  console.log("openNodeModal() called");
  let modal = document.getElementById("nodeModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "nodeModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "80%";
    modal.style.height = "80%";
    modal.style.background = "#2D3237";
    modal.style.border = "2px solid #555";
    modal.style.zIndex = "10000";
    modal.style.overflowY = "auto";
    modal.style.padding = "20px";
    
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.addEventListener("click", () => { modal.remove(); });
    modal.appendChild(closeButton);
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "svgCanvas");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    modal.appendChild(svg);
    
    document.body.appendChild(modal);
    console.log("Modal created and appended to body");
  }
  renderNodeTree(modal);
  updateWires();
  console.log("Modal should now be visible");
}

/* ===== MAIN INITIALIZATION ===== */
document.addEventListener("DOMContentLoaded", async function () {
  console.log("✅ Geppetto Smart Layer Manager Initialized!");
  
  const addLayerButton = document.getElementById("addLayer");
  const refreshButton = document.getElementById("refreshLayers");
  const groupLayersButton = document.getElementById("groupLayers");
  const unlockAllButton = document.getElementById("unlockAll");
  const globalRenameButton = document.getElementById("globalRename");
  const smartBookmarksButton = document.getElementById("smartBookmarks");
  const openNodeViewButton = document.getElementById("openNodeView");
  
  const uiContainer = document.getElementById("uiLayers");
  const gaContainer = document.getElementById("gaLayers");
  const bgContainer = document.getElementById("bgLayers");
  
  await ensureContainers();
  initializeContainerHeaders();
  
  addLayerButton.addEventListener("click", addNewLayer);
  refreshButton.addEventListener("click", updateLayers);
  groupLayersButton.addEventListener("click", async () => {
    console.log("📂 Group Selected Layers - Functionality to be implemented");
  });
  unlockAllButton.addEventListener("click", async () => {
    console.log("🔓 Unlock All Layers - Functionality to be implemented");
  });
  globalRenameButton.addEventListener("click", async () => {
    console.log("✏️ Global Rename - Functionality to be implemented");
  });
  smartBookmarksButton.addEventListener("click", async () => {
    console.log("⭐ Smart Bookmarks - Functionality to be implemented");
  });
  if (openNodeViewButton) {
    openNodeViewButton.addEventListener("click", () => {
      console.log("Node view button clicked");
      openNodeModal();
    });
  }
  
  async function addNewLayer() {
    const validContainers = ["UI", "GA", "BG"];
    let prefix = validContainers.includes(selectedContainer) ? selectedContainer + "_" : "";
    const newLayerName = prefix + "Layer_" + Date.now();
    await executeAsModal(async () => {
      await batchPlay([{ _obj: "make", _target: [{ _ref: "layer" }], name: newLayerName }], { synchronousExecution: true });
    }, { commandName: "Add New Layer" });
    console.log("Added layer:", newLayerName);
    await updateLayers();
  }
  
  async function ensureContainers() {
    const requiredGroups = ["UI", "GA", "BG"];
    for (let name of requiredGroups) {
      if (!(await getGroupId(name))) {
        await createGroup(name);
      }
    }
  }
  
  async function createGroup(name) {
    await executeAsModal(async () => {
      await batchPlay([{ _obj: "make", _target: [{ _ref: "layerSection" }], name }], { synchronousExecution: true });
    }, { commandName: "Create Main Group" });
    console.log("Created group:", name);
  }
  
  async function getGroupId(groupName) {
    let doc = app.activeDocument;
    const groupLayer = doc.layers.find(layer => layer.kind === "group" && layer.name === groupName);
    return groupLayer ? groupLayer.id : null;
  }
  
  async function getPhotoshopLayers() {
    function traverse(layers) {
      let result = [];
      layers.forEach(layer => {
        if (layer.kind === "group" && (layer.name === "UI" || layer.name === "GA" || layer.name === "BG")) {
          result = result.concat(traverse(layer.layers));
        } else {
          const obj = {
            id: layer.id,
            name: layer.name,
            kind: layer.kind,
            children: layer.layers ? traverse(layer.layers) : []
          };
          obj.group = getLayerGroup(obj.name);
          result.push(obj);
        }
      });
      return result;
    }
    return traverse(app.activeDocument.layers);
  }
  
  function getLayerGroup(layerName) {
    if (layerName === "UI" || layerName === "GA" || layerName === "BG") return layerName;
    if (layerName.startsWith("UI_")) return "UI";
    if (layerName.startsWith("GA_")) return "GA";
    if (layerName.startsWith("BG_")) return "BG";
    return "BG";
  }
  
  document.querySelectorAll(".layer-group").forEach(container => {
    container.addEventListener("dragover", event => {
      event.preventDefault();
      container.classList.add("drag-over");
    });
    container.addEventListener("dragleave", () => {
      container.classList.remove("drag-over");
    });
    container.addEventListener("drop", async event => {
      event.preventDefault();
      container.classList.remove("drag-over");
      const layerId = event.dataTransfer.getData("text/plain");
      const targetContainer = container.dataset.container;
      console.log("Dropping layer", layerId, "into container", targetContainer);
      await moveLayerToGroup(layerId, targetContainer);
      await updateLayers();
    });
  });
  
  async function moveLayerToGroup(layerId, targetGroup) {
    let doc = app.activeDocument;
    let layer = doc.layers.find(l => l.id == layerId);
    if (layer) {
      let currentName = layer.name;
      let desiredPrefix = targetGroup + "_";
      if (!currentName.startsWith(desiredPrefix)) {
        let newName = desiredPrefix + currentName;
        await executeAsModal(async () => {
          await batchPlay([{
            _obj: "set",
            _target: [{ _ref: "layer", _id: layerId }],
            to: { name: newName }
          }], { synchronousExecution: true });
        }, { commandName: "Update Layer Prefix" });
        console.log(`Updated layer ${layerId} name to ${newName}`);
      }
    }
    console.log(`Moving layer ${layerId} to container ${targetGroup} - (logic to be implemented)`);
  }
  
  setInterval(() => {
    if (!isDragging && !isRenaming && (Date.now() - lastInteractionTime >= userInteractionThreshold)) {
      updateLayers();
    }
  }, 3000);
  
  async function updateLayers() {
    try {
      let layers = await getPhotoshopLayers();
      uiContainer.innerHTML = "";
      gaContainer.innerHTML = "";
      bgContainer.innerHTML = "";
      layers.forEach(layer => {
        let elem = createLayerElement(layer);
        if (layer.group === "UI") {
          uiContainer.appendChild(elem);
        } else if (layer.group === "GA") {
          gaContainer.appendChild(elem);
        } else {
          bgContainer.appendChild(elem);
        }
      });
      updateLayerSelection();
      console.log("Layers updated");
      const nodeModal = document.getElementById("nodeModal");
      if (nodeModal) {
        const treeData = await getPhotoshopLayers();
        const positioned = layoutNodes(treeData);
        renderPositionedNodeTree(nodeModal, positioned);
        renderNodeConnections();
      }
    } catch (error) {
      console.error("Error updating layers:", error);
    }
  }
  
  await updateLayers();
});
