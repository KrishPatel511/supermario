// Shared state between the on-screen touch buttons (React) and the Phaser scene.
// React writes to it on pointer events; PlayScene reads it every frame.

export const TouchInput = {
  left: false,
  right: false,
  jump: false,
  special: false,

  reset() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.special = false;
  },
};
