var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('log/request.log'),'request');


var request = log4js.getLogger('request');
module.exports = request;