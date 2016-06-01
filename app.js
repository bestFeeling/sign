var express = require('express')
var app = express()
var fs = require('fs')
var log = require('./log/log.js')
var bodyParser = require('body-parser')

//for post request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })) 

//CORS middleware
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

//template
app.use(express.static(__dirname + '/public'))
app.engine('ntl', function(filePath, options, callback) {
	fs.readFile(filePath, function(err, content) {
		if(err) 
			return callback(new Error(err))
		var rendered = content.toString().replace('#data#',JSON.stringify(options));
		return callback(null,rendered)
	})
})
app.set('views', __dirname + '/public')
app.set('view engine', 'ntl')
//orm
var orm = require('./model/index.js')

//
//  API
//

/**
 * @api {get} index -get user's sign page.
 * @apiName index
 * @apiGroup sign
 *
 * @apiParam {String} param need 3 param like '?uid=123&sid=123&mac=asd'
 means userid , shopid and mac address
 *
 * @apiSuccess return a comfirm page if the 'sid' match the 'mac'
 */
app.get('/index',function(req,res){
	var uid = req.query.uid,
		sid = req.query.sid,
		mac = req.query.mac
	if(mac){
		orm.mac.findAll({
			where: {
				mac_address: mac,
				shop_id: sid
			}
		}).then(function(ins){
			if(ins.length > 0){
				res.render('confirm', { uid: uid, sid: sid, mac: mac })
				log.info('confirm user: uid: '+uid+'  sid: '+sid+'  mac: '+mac)
			}
			else{  
				res.render('unconfirm', { uid: uid, sid: sid, mac: mac })
				log.info('unconfirm user: uid: '+uid+'  sid: '+sid+'  mac: '+mac)	
			}
		}).catch(function(e){
			log.error(e)
		})
	}
	else
		res.render('unconfirm', { uid: uid, sid: sid, mac: mac })
})
/**
 * @api {get} calendar -get user's sign log page.
 * @apiName calendar
 * @apiGroup calendar
 *
 * @apiParam {String} param need 3 param like '?uid=123&sid=123&mac=asd'
 means userid , shopid and mac address
 *
 * @apiSuccess return a calendar page with 'uid' , 'sid' , 'mac'
 */
app.get('/calendar',function(req,res){
	var uid = req.query.uid,
		sid = req.query.sid,
		mac = req.query.mac
	res.render('calendar', { uid: uid, sid: sid, mac: mac })
})

/**
 * @api {get} sign -action for user sign 
 * @apiName sign
 * @apiGroup sign
 *
 * @apiParam {String} param need 3 param like '?uid=123&sid=123&mac=asd'
 means userid , shopid and mac address
 *
 * @apiSuccess return a json object { code: 1,desc: 'success', data:{} }
 */
app.get('/sign',function(req,res) {
	var uid = req.query.uid,
		sid = req.query.sid,
		mac = req.query.mac
	if(mac) {
		orm.mac.findAll( {
			where: {
				mac_address: mac,
				shop_id: sid
			}
			}).then(function(ins) {
				if(ins.length > 0) {
					orm.sign.create( {
						user_id: uid,
						shop_id: sid,
						created_at: new Date().toString()
					}).then(function(ins) {
						log.info('sign user: uid: '+uid+'  sid: '+sid+'  mac: '+mac)
						res.json({ code: 1,desc: 'success', data:ins })
					}).catch(function(e){
						log.error(e)
						res.json({ code: -1,desc: 'sign error', data:{} })
					})
				}else res.json({ code: -2,desc: 'mac address not match', data:{} })
			}).catch(function(e) {
				log.error(e)
			})
		}
})
/**
 * @api {get} sign -get a user's sign log
 * @apiName sign
 * @apiGroup sign
 *
 * @apiParam {String} param need 4 param like '?uid=123&sid=123&start_time=2015-01-01&end_time=2016-01-01'
 means userid , shopid , start_time and end_time
 *
 * @apiSuccess return a json object { code: 1,desc: 'success', data:{} }
 */
app.get('/signlog',function(req,res){
	var uid = req.query.uid,
		sid = req.query.sid,
		st = new Date(req.query.start_time),
		et = new Date(req.query.end_time)
	if(!uid)
		res.json({ code:-1, desc: 'params error', data: {} })
	orm.sign.findAll({
		order: 'created_at DESC',
		where: {
			user_id: uid,
			shop_id: sid,
			created_at: {
				$between: [st,et]
			}
		}
	}).then(function(ins){
		log.info(JSON.stringify(ins)+"!")
		res.json({ code: 1, desc: 'success', data:ins })
	}).catch(function(e){
		log.error(e)
		res.json({ code: -2, desc: 'error', data:{} })
	})

})

app.get('/',function(req,res) {
	res.send("in server")
})

app.listen(3015,function() {
	console.log('listen on 3015')
})