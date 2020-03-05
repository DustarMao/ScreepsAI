require('ts-node').register()
var bundle = require('./publish/bundle').default
var publish = require('./publish').default

bundle().then(() => publish())