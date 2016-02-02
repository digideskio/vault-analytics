var db = require('../dist/mongoc')
var reporting = require('../dist/retriever')
var model = require('../dist/model')

var async = require('async')
var _ = require('underscore')
var pg = require('pg')

// Connect to postgres
pg.connect(process.env.PG_URL, function(err, client) {
  if (err) {
    throw new Error(err)
  }
  console.log('[OK] Connected to postgres')

  db.setup(function(connection) {
    console.log('[OK] Connected to mongo')
    // Retrieve the daily active user stats
    reporting.dailyActiveUsersFullGrouped(connection, function(err, results) {
      console.log(results)

      // Build funcs to execute
      var funcs = _.map(results, function(row) {
        return model.usageUpserter(client, row)
      })

      // Insert rows
      async.series(funcs, function(err, results) {
        if (err) {
          throw new Error(err)
        }
        console.log('Done')
        client.end()
        connection.close()
      })
    })
  })
})
