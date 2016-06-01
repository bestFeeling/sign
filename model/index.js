var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var config    = require('../config.js')

/**
*	DB_Test is a test sql origin
*	you can change it in config.js
*	
*/
var DB 		  = config.DB_Test;
var seq       = new Sequelize(DB.dbname, DB.user, DB.pw,{
				host: DB.dbaddress,
				dialect: DB.db
				});
var db        = {};
console.log(DB)
fs
	.readdirSync(__dirname + "/models")
	.filter(function(file) {
		return (file.indexOf('.') !== 0)&&(file !== 'index.js');
	})
	.forEach(function(file) {
		var model = seq.import(path.join(__dirname + "/models", file));
		console.log("     load model : "+model.name);
		db[model.name] = model;
	});

	Object.keys(db).forEach(function(modelName){
		if('associate' in db[modelName]){
			db[modelName].associate(db);
			console.log('add associate : '+modelName)
		}
	}); 



db.sequelize = seq;
db.Sequelize = Sequelize;

module.exports = db;
