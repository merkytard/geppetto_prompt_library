export function pulseElement(el) {
    if (el) {
        el.classList.add('pulsing');
        setTimeout(() => el.classList.remove('pulsing'), 1000);
    }
}
