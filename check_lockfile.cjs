const fs = require('fs');
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
const missing = [];

for (const dep in dependencies) {
  if (!lock.packages['node_modules/' + dep]) {
    missing.push(dep);
  }
}

console.log('Missing packages in lockfile:', missing);
