registerAnimator('sin', class {
    constructor(options = {}) {
        this.maxOut = options.maxOut || 3000;
    }
    animate(currentTime, effect) { 
        let minIn = -1, maxIn = 1, 
            minOut = 0, maxOut = this.maxOut; // 映射到时间范围[minOut, maxOut]
        let v = Math.sin(currentTime * 2 * Math.PI / maxOut);

        effect.localTime = (v - minIn)/(maxIn - minIn) * (maxOut - minOut) + minOut;
    }
});