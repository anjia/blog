

registerAnimator('hellworld', class {
  animate(currentTime, effect) {
      effect.localTime = currentTime;
  }
});