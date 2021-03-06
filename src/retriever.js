var moment = require('moment')

var platforms = {
  darwin: 'osx',
  win32: 'winx64'
}

exports.crashesForYMDPlatform = (db, ymd, platform, cb) => {
  var query = db.collection('crashes').aggregate([
    {
      $project: {
        date: {
          $add: [ (new Date(0)), '$ts' ]
        },
        _version: 1,
        ver: 1,
        ptime: 1,
        platform: {
          $ifNull: [ '$platform', 'unknown' ]
        },
        ymd: {
          $dateToString: {
            format: '%Y-%m-%d', date: {
              $add: [ (new Date(-5 * 60 * 60000)), '$ts' ]
            }
          }
        }
      }
    },
    {
      $match: {
        platform: platform,
        ymd: ymd
      }
    }])

  query.toArray((err, results) => {
    console.log(results.length)
    cb(err, results)
  })
}

exports.dailyCrashReportsFullGrouped = (db, cb, ts, days) => {
  ts = ts || (new Date()).getTime()
  days = days || 7

  var query = db.collection('crashes').aggregate([
    {
      $project: {
        date: {
          $add: [ (new Date(0)), '$ts' ]
        },
        platform: {
          $ifNull: [ '$platform', 'unknown' ]
        },
        channel: {
          $ifNull: [ '$channel', 'dev' ]
        },
        version: {
          $ifNull: [ '$_version', '0.0.0' ]
        },
        ymd: {
          $dateToString: {
            format: '%Y-%m-%d', date: {
              $add: [ (new Date(-5 * 60 * 60000)), '$ts' ]
            }
          }
        }
      }
    },
    {
      $group: {
        _id: {
          ymd: '$ymd',
          platform: '$platform',
          version: '$version',
          channel: '$channel'
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        '_id.ymd': -1,
        '_id.platform': 1,
        '_id.version': 1,
        '_id.channel': 1
      }
    }
  ])

  query.toArray((err, results) => {
    results = results.map((result) => {
      result._id.platform = platforms[result._id.platform] || 'unknown'
      return result
    })
    cb(err, results)
  })
}

exports.dailyActiveUsersFullGrouped = (db, exceptions, cb, ts, days) => {
  ts = ts || (new Date()).getTime()
  days = days || 7

  var limit = moment().subtract(1, 'days').format('YYYY-MM-DD')
  console.log(`Retrieving records on and after ${limit}`)

  var query = db.collection('usage').aggregate([
    {
      $match: {
        year_month_day: { $gte: limit }
      }
    },
    {
      $match: { daily: true }
    },
    {
      $project: {
        date: {
          $add: [ (new Date(0)), '$ts' ]
        },
        platform: {
          $ifNull: [ '$platform', 'unknown' ]
        },
        version: {
          $ifNull: [ '$version', '0.0.0' ]
        },
        first_time: {
          $ifNull: [ '$first', false ]
        },
        channel: {
          $ifNull: [ '$channel', 'dev' ]
        },
        ymd: {
          $ifNull: [ '$year_month_day', '2016-02-10']
        }
      }
    },
    {
      $group: {
        _id: {
          ymd: '$ymd',
          platform: '$platform',
          version: '$version',
          first_time: '$first_time',
          channel: '$channel'
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        '_id.ymd': -1,
        '_id.platform': 1,
        '_id.version': 1,
        '_id.first_time': 1,
        '_id.channel': 1
      }
    }
  ], { explain: false })

  query.toArray((err, result) => {
    if (err) {
      throw new Error(err)
    } else {
      result = result.concat(exceptions)
    }
    cb(err, result)
  })
}

exports.dailyActiveAndroidUsersFullGrouped = (db, exceptions, cb) => {
  var limit = moment().subtract(14, 'days').format('YYYY-MM-DD')
  console.log(`Retrieving records on and after ${limit}`)

  var query = db.collection('android_usage').aggregate([
    {
      $match: {
        year_month_day: { $gte: limit }
      }
    },
    {
      $match: { daily: true }
    },
    {
      $project: {
        date: {
          $add: [ (new Date(0)), '$ts' ]
        },
        platform: {
          $ifNull: [ '$platform', 'unknown' ]
        },
        version: {
          $ifNull: [ '$version', '0.0.0' ]
        },
        first_time: {
          $ifNull: [ '$first', false ]
        },
        channel: {
          $ifNull: [ '$channel', 'dev' ]
        },
        ymd: {
          $ifNull: [ '$year_month_day', '2016-02-10']
        }
      }
    },
    {
      $group: {
        _id: {
          ymd: '$ymd',
          platform: '$platform',
          version: '$version',
          first_time: '$first_time',
          channel: '$channel'
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        '_id.ymd': -1,
        '_id.platform': 1,
        '_id.version': 1,
        '_id.first_time': 1,
        '_id.channel': 1
      }
    }
  ], { explain: false })

  query.toArray((err, result) => {
    if (err) {
      throw new Error(err)
    } else {
      result = result.concat(exceptions)
    }
    cb(err, result)
  })
}

exports.dailyActiveiOSUsersFullGrouped = (db, exceptions, cb) => {
  var limit = moment().subtract(14, 'days').format('YYYY-MM-DD')
  console.log(`Retrieving records on and after ${limit}`)

  var query = db.collection('ios_usage').aggregate([
    {
      $match: {
        year_month_day: { $gte: limit }
      }
    },
    {
      $match: { daily: true }
    },
    {
      $project: {
        date: {
          $add: [ (new Date(0)), '$ts' ]
        },
        platform: {
          $ifNull: [ '$platform', 'unknown' ]
        },
        version: {
          $ifNull: [ '$version', '0.0.0' ]
        },
        first_time: {
          $ifNull: [ '$first', false ]
        },
        channel: {
          $ifNull: [ '$channel', 'dev' ]
        },
        ymd: {
          $ifNull: [ '$year_month_day', '2016-02-10']
        }
      }
    },
    {
      $group: {
        _id: {
          ymd: '$ymd',
          platform: '$platform',
          version: '$version',
          first_time: '$first_time',
          channel: '$channel'
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        '_id.ymd': -1,
        '_id.platform': 1,
        '_id.version': 1,
        '_id.first_time': 1,
        '_id.channel': 1
      }
    }
  ], { explain: false })

  query.toArray((err, result) => {
    if (err) {
      throw new Error(err)
    } else {
      result = result.concat(exceptions)
    }
    cb(err, result)
  })
}

/*
 * Retrieve the new monthly active user for
 * a range of days
 *
 * @param db {Object} - Mongo connection
 * @param cb {function(Object, Array[Object]} - Callback
 * @param collection {String} - Name of Mongo collection to inspect
 */
exports.monthlyUsersByDay = (db, cb, collection) => {
  collection = collection || 'usage'

  var query = db.collection(collection).aggregate([
    {
      $match: { monthly: true }
    },
    {
      $project: {
        date: {
          $add: [ (new Date(0)), '$ts' ]
        },
        platform: {
          $ifNull: [ '$platform', 'unknown' ]
        },
        version: {
          $ifNull: [ '$version', '0.0.0' ]
        },
        channel: {
          $ifNull: [ '$channel', 'dev' ]
        },
        ymd: {
          $dateToString: {
            format: '%Y-%m-%d', date: {
              $add: [ (new Date(-5 * 60 * 60000)), '$ts' ]
            }
          }
        }
      }
    },
    {
      $match: {
        ymd: { $gt: '2016-01-18' }
      }
    },
    {
      $group: {
        _id: {
          ymd: '$ymd',
          platform: '$platform',
          version: '$version',
          channel: '$channel'
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        '_id.ymd': -1,
        '_id.platform': 1,
        '_id.version': 1,
        '_id.channel': 1
      }
    }
  ])

  query.toArray((err, result) => {
    cb(err, result)
  })
}

exports.dailyTelemetry = (db, collection, days, cb) => {
  days = days || 7

  var limit = moment().subtract(days, 'days').format('YYYY-MM-DD')
  console.log(`Retrieving records on and after ${limit}`)

  var query = db.collection(collection).aggregate([
    {
      $match: {
        ymd: { $gte: limit }
      }
    },
    {
      $sort: {
        'ymd': -1,
        'platform': 1,
        'version': 1,
        'channel': 1,
        'measure': 1,
        'machine': 1
      }
    }
  ])

  query.toArray(cb)
}
