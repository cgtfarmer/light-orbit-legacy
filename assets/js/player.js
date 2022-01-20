class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 125;
    this.y = 125;
    this.maxSpeedX = 10;
    this.maxSpeedY = 10;
    this.speedX = 0;
    this.speedY = 0;
    this.health = 100;
    this.dps = 10;
    this.enemyTarget = null;
    this.inventory = new Inventory();
  }

  targetNearestEnemy() {
  }

  attackEnemyTarget() {
  }

  collect() {
    console.log('[Player] [Collect]');
    for (let i = 0; i < game.currentMap.bonusBoxes.length; i++) {
      const bonusBox = game.currentMap.bonusBoxes[i];
      if (this.collectibleInRange(bonusBox)) {
        this.collectBonusBox(bonusBox);
        return { 'type': 'bonusBox', 'index': i };
      }
    }

    if (this.inventory.size >= this.inventory.capacity) {
      console.log('ERROR: Inventory is full');
      return -1;
    }

    for (let i = 0; i < game.currentMap.resources.length; i++) {
      const resource = game.currentMap.resources[i];
      if (this.collectibleInRange(resource)) {
        this.inventory.addResource(resource.constructor.name, 1)
        return { 'type': 'resource', 'index': i };
      }
    }

    return -1;
  }

  collectBonusBox(bonusBox) {
    console.log('[Player] [Collect] [Collect Bonus Box]');
    for (let reward of bonusBox.rewards) {
      // console.log(reward);
      if (reward['name'] == 'Credits') {
        this.inventory.addCredits(reward['quantity']);
      } else if (reward['name'] == 'Uridium') {
        this.inventory.addUridium(reward['quantity']);
      } else if (reward['name'] == 'Ammunition') {
        this.inventory.addAmmunition(reward['quantity']);
      }
    }
  }

  collectResource() {
    if (this.inventory.size >= this.inventory.capacity) {
      console.log('ERROR: Inventory is full');
      return -1;
    }

    for (let i = 0; i < game.currentMap.resources.length; i++) {
      const resource = game.currentMap.resources[i];
      if (this.collectibleInRange(resource)) {
        this.inventory.addResource(resource.constructor.name, 1)
        return i;
      }
    }
  }

  collectibleInRange(collectible) {
    if (
      (this.x < collectible.x) &&
      (collectible.x < (this.x + this.width)) &&
      (this.y < collectible.y) &&
      (collectible.y < (this.y + this.height))
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    game.ctx.beginPath();
    game.ctx.fillStyle = 'black';
    game.ctx.rect(this.x, this.y, this.width, this.height);
    game.ctx.fill();
    game.ctx.stroke();
  }
}

