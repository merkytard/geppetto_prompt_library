/* 📌 Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Consolas', monospace;
    font-size: 13px;
    background: #2E3440;
    color: #D8DEE9;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

/* 📌 Horná lišta */
.top-bar {
    width: 100%;
    background: #3B4252;
    padding: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
    position: fixed;
    top: 0;
    z-index: 1000;
}

.btn {
    background: #4C566A;
    color: #ECEFF4;
    border: 1px solid #88C0D0;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.2s ease;
}

.btn:hover {
    background: #88C0D0;
}

/* 📌 Node Container */
#nodeContainer {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: calc(100vh - 60px);
    background: rgba(50, 54, 67, 0.9);
    border-radius: 8px;
    box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    /* Styles for menu list items */
.menu__list-item {
  display: list-item;
  background-color: rgba(0, 0, 0, 0); /* Transparent background */
  color: rgb(245, 246, 247); /* Light gray text color */
  list-style: none; /* Remove default list bullets */
  padding: 0; /* Remove default padding */
}

/* Styles for menu links */
.menu__link {
  display: flex;
  background-color: rgba(0, 0, 0, 0); /* Transparent background */
  color: rgb(218, 221, 225); /* Light gray text color */
  text-decoration: none; /* Remove underline */
  padding: 0.5rem 1rem;
}

/* Active link */
.menu__link.navbar__link--active{
  color: rgb(0, 162, 123);

}

/* 📌 SVG Canvas */
#svgCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
}

/* 📌 Node */
.node {
    position: absolute;
    width: 220px;
    background: #4C566A;
    border-radius: 10px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
    color: #ECEFF4;
    display: flex;
    flex-direction: column;
    padding: 10px;
    cursor: grab;
    transition: all 0.2s ease-in-out;
}

.output-node {
    background: #5E81AC;
}

/* 📌 X na vymazanie (vpravo hore) */
.remove-node {
    position: absolute;
    top: 5px;
    right: 5px;
    background: red;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    width: 20px;
    height: 20px;
}

.remove-node:hover {
    background: darkred;
}

/* 📌 Rozšíriteľná časť nodu */
.node-body {
    display: none;
    width: 100%;
    margin-top: 5px;
    padding: 5px;
    background: #3B4252;
    border-radius: 5px;
}

.node.open .node-body {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

/* 📌 Porty */
.node-port {
    width: 16px;
    height: 16px;
    background: #81A1C1;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    position: absolute;
}

.node-port:hover {
    transform: scale(1.1);
}

.input-port {
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
}

.output-port {
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    background: #BF616A;
}

/* 📌 SVG linky medzi nodmi */
svg path {
    fill: none;
    stroke: #ECEFF4;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
}
