class Death() {
  constructor(position) {
    this.position = position;
    this.increment = 0;
  }
  step() {
    this.increment++;
    if (this.increment>120) {
      removeDeath(this)
      removeActor(this)
    }
  }
  draw() {

  }
}
