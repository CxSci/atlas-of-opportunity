const path = require('path')

module.exports = {
  resolve: {
    alias: {
      // resolves multiple React instance issue
      react: path.resolve('./node_modules/react')
    }
  }
}
