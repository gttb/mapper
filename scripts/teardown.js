(function () {
  'use strict';
  var db = require("org/arangodb").db;

  
  db._drop("email_map");
  
}());
