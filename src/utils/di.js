'use strict';

export class DIContainer {
  constructor() {
    this.container = new Map();
  }

  register(name, instance) {
    this.container.set(name, instance);
  }
  
  resolve(name) {
    return this.container.get(name);
  }
}
