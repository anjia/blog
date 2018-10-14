registerAnimator('scrollDriven', class {
  animate(currentTime = 0, effect) {
    effect.localTime = currentTime;
  }
});