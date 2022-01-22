class InputHandler {
  static keydownEvent = 'keydown';
  static listeningKeys = [
    KeyCode.w,
    KeyCode.a,
    KeyCode.s,
    KeyCode.d,
    KeyCode.spacebar,
    KeyCode.tab,
    KeyCode.esc,
    KeyCode.f,
    KeyCode.j,
    KeyCode.leftArrow,
    KeyCode.rightArrow,
    KeyCode.upArrow,
    KeyCode.downArrow
  ];

  constructor() {
    this.keys = {};
    this.spaceHasBeenEvaluated = false;
    this.tabHasBeenEvaluated = false;
    this.escHasBeenEvaluated = false;
    this.jHasBeenEvaluated = false;
  }

  registerKey(event) {
    // Don't register if opposite key is currently registered?
    // console.log(event.keyCode);
    if (InputHandler.listeningKeys.includes(event.keyCode)) {
      event.preventDefault();
    }

    this.keys[event.keyCode] = (event.type == InputHandler.keydownEvent);
  }

  unregisterKey(event) {
    this.keys[event.keyCode] = (event.type == InputHandler.keydownEvent);
    if (event.keyCode == KeyCode.spacebar) this.spaceHasBeenEvaluated = false;
    if (event.keyCode == KeyCode.tab) this.tabHasBeenEvaluated = false;
    if (event.keyCode == KeyCode.esc) this.escHasBeenEvaluated = false;
    if (event.keyCode == KeyCode.j) this.jHasBeenEvaluated = false;
  }

  performKeyActions() {
    if (Object.keys(this.keys).length == 0) return;

    if (this.keys[KeyCode.a] || this.keys[KeyCode.leftArrow]) { game.player.speedX = game.player.maxSpeedX * -1; }
    if (this.keys[KeyCode.d] || this.keys[KeyCode.rightArrow]) { game.player.speedX = game.player.maxSpeedX; }
    if (this.keys[KeyCode.w] || this.keys[KeyCode.upArrow]) { game.player.speedY = game.player.maxSpeedY * -1; }
    if (this.keys[KeyCode.s] || this.keys[KeyCode.downArrow]) { game.player.speedY = game.player.maxSpeedY; }

    if (this.keys[KeyCode.j] && !this.jHasBeenEvaluated) {
      this.jHasBeenEvaluated = true;

      for (let i = 0; i < game.currentMap.portals.length; i++) {
        const portal = game.currentMap.portals[i];
        if (game.player.portalInRange(portal)) {
          portal.jump();
        }
      }
    }

    if (this.keys[KeyCode.tab] && !this.tabHasBeenEvaluated) {
      this.tabHasBeenEvaluated = true;
      game.player.targetNearestEnemy();
    }

    if (this.keys[KeyCode.esc] && !this.escHasBeenEvaluated) {
      console.log('[Input Handler] [Escape]');
      this.escHasBeenEvaluated = true;

      if (game.player.attackingEnemy) {
        game.player.cancelAttack();
      } else if (game.player.enemyTarget) {
        game.player.cancelTarget();
      }
    }

    if (this.keys[KeyCode.f]) {
      game.player.attackEnemyTarget();
    }

    if (this.keys[KeyCode.spacebar] && !this.spaceHasBeenEvaluated) {
      this.spaceHasBeenEvaluated = true;
      const results = game.player.collect();
      if (results == -1) return;

      if (results['type'] == 'resource') {
        new SuccessMessage(`Received: ${game.currentMap.resources[results['index']].toString()}`);
        game.currentMap.resources.splice(results['index'], 1);
        game.currentMap.generateRandomResource();
      } else if (results['type'] == 'bonusBox') {
        new SuccessMessage(`Received: ${game.currentMap.bonusBoxes[results['index']].toString()}`);
        game.currentMap.bonusBoxes.splice(results['index'], 1);
        game.currentMap.generateRandomBonusBox();
      } else if (results['type'] == 'loot') {
        new SuccessMessage(`Received: ${game.currentMap.loot[results['index']].toString()}`);
        game.currentMap.loot.splice(results['index'], 1);
      }
    }
  }
}

