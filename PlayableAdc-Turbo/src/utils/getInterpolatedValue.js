export function getInterpolatedValue(start, end, t, easing = 'linear') {
    let i=t;
    switch (easing) {
        case 'easeIn':
            i = t * t; break;
        case 'easeOut':
            i = t * (2 - t); break;
        case 'easeInOut':
            i = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; break;
    }
    return start + (end - start) * i;
}