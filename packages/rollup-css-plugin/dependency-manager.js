class DependencyManager {
  constructor() {
    this.dependencies = new Map();
    this.MAX_ITERATION_LIMIT = 100000;
  }

  addDependency(sourceFile, targetFile) {
    if (!this.dependencies.has(sourceFile)) {
      this.dependencies.set(sourceFile, new Set());
    }

    this.dependencies.get(sourceFile).add(targetFile);

    if (!this.dependencies.has(targetFile)) {
      this.dependencies.set(targetFile, new Set());
    }
  }

  getOrderedFiles() {
    const orderedFiles = this._performInitialSort();

    return this._optimizeFileOrder(orderedFiles);
  }

  _performInitialSort() {
    const visited = new Set();
    const result = [];

    const visit = (file) => {
      if (visited.has(file)) return;

      visited.add(file);

      const deps = this.dependencies.get(file) || new Set();
      for (const dependency of deps) {
        visit(dependency);
      }

      result.push(file);
    };

    for (const file of this.dependencies.keys()) {
      visit(file);
    }

    return result;
  }

  _optimizeFileOrder(initialOrder) {
    const order = [...initialOrder];
    let madeChanges;
    let iterations = 0;

    do {
      madeChanges = false;
      iterations++;

      if (iterations > this.MAX_ITERATION_LIMIT) {
        throw new Error("Circular dependency detected in CSS files");
      }

      for (let i = 0; i < order.length; i++) {
        const file = order[i];
        const fileDependencies = this.dependencies.get(file) || new Set();

        for (const dependency of fileDependencies) {
          const dependencyIndex = order.indexOf(dependency);

          if (dependencyIndex > i) {
            order.splice(dependencyIndex, 1);
            order.splice(i, 0, dependency);

            madeChanges = true;
            break;
          }
        }

        if (madeChanges) break;
      }
    } while (madeChanges);

    return order;
  }
}

module.exports = {
  DependencyManager,
};
