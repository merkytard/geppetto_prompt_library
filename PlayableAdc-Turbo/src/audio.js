export function playSound(path = '/assets/click.svg.mp3') {
    const audio = new Audio(path);
    audio.play();
}
