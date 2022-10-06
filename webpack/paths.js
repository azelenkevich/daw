const path = require('path');

//------------------------------------------------------------------------------

const rootDir = path.resolve(__dirname, '../');

module.exports = {
  modules: path.resolve(path.join(rootDir, 'node_modules')),
  assets: path.resolve(path.join(rootDir, 'src/assets')),
  src: path.resolve(path.join(rootDir, 'src')),
  build: path.resolve(path.join(rootDir, 'build')),
  index: path.resolve(path.join(rootDir, 'src/index.tsx')),
  template: path.resolve(path.join(rootDir, 'public/template.html')),
};
