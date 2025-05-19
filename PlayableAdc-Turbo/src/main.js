import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('beta-pulse');
    if (playButton) {
        playButton.classList.add('shine');
    }
});