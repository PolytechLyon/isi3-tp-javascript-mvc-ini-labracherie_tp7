import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL,
  SQUARE
} from "./constants.js";

export class Model {
  constructor(width = GAME_SIZE, height = GAME_SIZE) {
    this.width = width || GAME_SIZE;
    this.height = height || GAME_SIZE;
    this.raf = null;
    this.observers = [];
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );

    if (this.width >= 9 && this.height >= 7) {
      DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
        this.state[y][x] = CELL_STATES.ALIVE;
      });
    }
    this.updated();
  }

  run(date = new Date().getTime()) {

    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        const changes = {};

        for (let i = 0; i < this.height; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(j, i);

            if (nbAlive === 3) {
              if (changes[CELL_STATES.ALIVE] === undefined) {
                changes[CELL_STATES.ALIVE] = [];
              }
              changes[CELL_STATES.ALIVE].push({ y: i, x: j });
            } else if (nbAlive != 2 && this.state[i][j] !== CELL_STATES.NONE) {
              if (changes[CELL_STATES.DEAD] === undefined) {
                changes[CELL_STATES.DEAD] = [];
              }
              changes[CELL_STATES.DEAD].push({ y: i, x: j });
            }
          }
        }

        Object.entries(changes).forEach(([state, coords]) => coords.forEach(({ x, y }) => this.state[y][x] = state));

        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    this.stop();
    this.init();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.width &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;

    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (i === x && j === y) continue;
        number += this.isCellAlive(i, j);
      }
    }

    return number;
  }

  toggleState(x, y) {
    switch (this.state[y][x]) {
      case CELL_STATES.NONE:
        this.state[y][x] = CELL_STATES.ALIVE;
        break;
      case CELL_STATES.ALIVE:
        this.state[y][x] = CELL_STATES.DEAD;
        break;
      case CELL_STATES.DEAD:
        this.state[y][x] = CELL_STATES.NONE;
        break;
    }
    this.updated();
  }

  updated() {
    this.observers.forEach(observer => {
      switch (typeof observer) {
        case "function":
          observer(this);
          break;
        case "object":
          observer.update(this);
          break;
        default:
          throw "Observer must be function or object with update() implemented";
      }
    })
  }

  addObserver(observer) {
    this.observers.push(observer);
  }
}
