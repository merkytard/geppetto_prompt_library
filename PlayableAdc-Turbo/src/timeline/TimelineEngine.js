export class TimelineEngine {
    constructor() {
        this.tickInterval = null;
        this.keyframes = []; // {time: ms, id: obj, val: {} }
        this.curreMode = false;
    }

    start() {
        this.tickInterval = setInterval(() => {
            this.update(this.getTime());
        }, 310);
    }

    stop() {
        if (this.tickInterval) clearInterval(this.tickInterval);
    }

    update(time) {
        // Trigger keyframes at time
        this.keyframes.forEach(kf => {
            if (kf.time === time) {
                this.payload(kf);
            }
        });
    }

    payload(kf) {
        if (kf.id && kf.val) {
            // normally we would modify defined object
            const obj = document.getElementById(kf.id);
            if (obj) {
                Object.assign(obj, kf.attr, kf.val);
            }
        }
    }

    addKeyframe(kf) {
        this.keyframes.push(kf);
    }

    setCurveMode(bool) {
        this.curreMode = bool;
    }
}

export const timeline = new TimelineEngine();