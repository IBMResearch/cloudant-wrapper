var Cloudant = require('cloudant');

// Auxiliar Methods

function _update(db, ddoc, id, options, attempts, callback){
  if (options && options.timestamp){
    ddoc._lastModificationDate = new Date().getTime();
  }
  db.insert(ddoc, id, function(err, respond) {
    if (err){
      if (attempts > 0){
        _update(db, ddoc, id, options, --attempts, callback);
      } else {
        return callback(err);
      }
    } else {
      return callback(null, respond);
    }
  });
}

function _create(db, ddoc, options, attempts, callback){
  if (options && options.timestamp){
    ddoc._creationDate = new Date().getTime();
  }
  db.insert(ddoc, function(err, respond) {
    if (err){
      if (attempts > 0){
        _create(db, ddoc, options, --attempts, callback);
      } else {
        return callback(err);
      }
    } else {
      return callback(null, respond)
    }
  });
}

function _delete(db, id, rev, options, attempts, callback){
  db.destroy(id, rev, function(err) {
    if (err){
      if (attempts > 0){
        _delete(db, id, rev, options, --attempts, callback);
      } else {
        return callback(err);
      }
    } else {
      return callback(null, true);
    }
  });
}

function _findById(db, id, callback){
  db.find({selector: {_id: id}}, function(err, response) {
    if (err || !response || !response.docs || response.docs.length < 1) {
      callback("NOT_FOUND");
    } else {
      callback(null, response.docs[0]);
    }
  });
}

// Class

function CloudantDatabase(url, nameDB, options) {
  var cloudant = Cloudant(url);
  this.db = cloudant.db.use(nameDB);
  this.options = options || {};
}

CloudantDatabase.prototype.view = function(ddocName, viewName, query, callback) {
  if (!ddocName || !viewName){
    return callback("INVALID_DATA");
  }
  query = query || {};
  this.db.view(ddocName, viewName, query, function(err, respond) {
    if (err || !respond || !respond.rows) {
      var error = err || "NOT_FOUND";
      return callback(error);
    }

    var ret = {};
    ret.data = respond.rows;
    if (respond.offset){
      ret.offset = respond.offset;
    }
    if (respond.total_rows){
      ret.total = respond.total_rows;
    }
    return callback(null, ret);
  });
}

CloudantDatabase.prototype.search = function(ddocName, searchName, query, callback) {
  if (!ddocName || !searchName){
    return callback("INVALID_DATA");
  }
  query = query || {};
  this.db.search(ddocName, searchName, query, function(err, respond) {
    if (err || !respond || !respond.rows) {
      var error = err || "NOT_FOUND";
      return callback(error);
    }

    try {
      var res = {};
      if (respond.bookmark){
        res.bookmark = respond.bookmark;
      }
      if (respond.total_rows){
        res.total = respond.total_rows;
      }
      var results = [];
      for (var i = 0; i < respond.rows.length; i++) {
        var result = {};
        result.id = respond.rows[i].id;
        if (query.include_docs) {
          for (var field in respond.rows[i].doc) {
            result[field] = respond.rows[i].doc[field];
          }
        } else {
          for (var field in respond.rows[i].fields) {
            result[field] = respond.rows[i].fields[field];
          }
        }
        results.push(result);
      };

      res.data = results;
      return callback(null, res);
    } catch (exception) {
      return callback("FAIL_IN_SEARCH");
    }
  });
}

CloudantDatabase.prototype.viewList = function(ddocName, viewName, listName, query, callback) {
  if (!ddocName || !viewName){
    return callback("INVALID_DATA");
  }
  query = query || {};
  this.db.viewWithList(ddocName, viewName, listName, query, function(err, respond) {
    if (err || !respond) {
      var error = err || "NOT_FOUND";
      return callback(error);
    }

    var ret = {};
    if (respond.rows){
      ret.data = respond.rows;
      if (respond.total){
        ret.total = respond.total;
      }
    } else {
      ret.data = respond;
    }

    return callback(null, ret);
  });
}

CloudantDatabase.prototype.create = function(ddoc, callback) {
  if (!ddoc){
    return callback("INVALID_DATA");
  }
  _create(this.db, ddoc, this.options, 5, callback);
}

CloudantDatabase.prototype.update = function(id, fields, callback) {
  var db = this.db;
  if (!id || !fields){
    return callback("INVALID_DATA");
  }
  _findById(db, id, function(err, ddoc){
    if (err){
      callback(err);
    } else {
      delete fields._id;
      delete fields._rev;
      for (var key in fields){
        ddoc[key] = fields[key];
      }
      _update(db, ddoc, id, this.options, 5, callback);
    }
  });
}

CloudantDatabase.prototype.delete = function(id, callback) {
  var db = this.db;
  if (!id){
    return callback("INVALID_DATA");
  }
  _findById(db, id, function(err, ddoc){
    if (err){
      callback(err);
    } else {
      _delete(db, id, ddoc._rev, this.options, 5, callback);
    }
  });

}

module.exports = CloudantDatabase;
