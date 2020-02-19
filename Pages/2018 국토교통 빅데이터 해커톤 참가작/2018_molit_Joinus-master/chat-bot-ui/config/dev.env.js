var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://localhost:3000"'
  // API_URL: '"https://us-central1-samplebuilders.cloudfunctions.net"'
})
