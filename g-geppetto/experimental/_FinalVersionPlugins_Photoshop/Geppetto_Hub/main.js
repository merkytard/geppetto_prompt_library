function toggleFull(id) {
  const el = document.getElementById(id);
  el.classList.toggle('fullscreen');
}

function toggleTheme() {
  const r = document.documentElement;
  const bg = getComputedStyle(r).getPropertyValue('--bg-color').trim();
  if(bg === '#2D2D2D'){
    r.style.setProperty('--bg-color', '#F0F0F0');
    r.style.setProperty('--text-color', '#222');
    r.style.setProperty('--button-color', '#ccc');
  } else {
    r.style.setProperty('--bg-color', '#2D2D2D');
    r.style.setProperty('--text-color', '#fff');
    r.style.setProperty('--button-color', '#3E3E3E');
  }
}

const unlockBtn = document.getElementById('unlockBtn');
const lockBtn   = document.getElementById('lockBtn');
const layersList= document.getElementById('layersList');

unlockBtn.addEventListener('click', () => {
  [...layersList.children].forEach(div => {
    const span = div.querySelector('span');
    if(span) span.textContent = '[Unlock]';
  });
});

lockBtn.addEventListener('click', () => {
  [...layersList.children].forEach(div => {
    const span = div.querySelector('span');
    if(span) span.textContent = '[Lock]';
  });
});
