const express = require('express');
const app = express();

const IpfsApi = require('ipfs-api');
const ipfs = IpfsApi('localhost', '5001');
var ipfsPeerId = null;
var pricePlanId = null;

ipfs.id(function(err, identity)
{
	console.log(identity.id);
	ipfsPeerId = identity.id;
});

//distributed database
const OrbitDB = require('orbit-db');
const orbitdb = new OrbitDB(ipfs);
const hoteldatabase = orbitdb.docstore('application.hotels.database');

var Datastore = require('nedb')
  , hotelinfoDB = new Datastore({ filename: 'hotelinfo', autoload: true })
  , roomtypesDB = new Datastore({ filename: 'roomtypes', autoload: true })
  , priceplanDB = new Datastore({ filename: 'priceplan', autoload: true });



app.get('/', function(req, res)
{
	hoteldatabase.events.on('ready', (dbname) => {
		console.log(dbname);
		console.log("ready");
	});

	hoteldatabase.events.on('load', (dbname) => {
		console.log(dbname);
		console.log("loaded");
	});

	hoteldatabase.events.on('load.progress', (dbname, hash, entry, progress) => 
	{
		console.log("downloading");
	});

	hoteldatabase.load();
	res.sendFile(__dirname + "/index.html");
});

app.get('/getipfspeerid', function(req, res){
	res.send(ipfsPeerId);
});

//OrbitDB
app.get('/saveHotelInfoNetWork', function(req,res)
{
	hotelinfoDB.findOne({}, function(err, hotelinfo)
	{
		hoteldatabase.put(hotelinfo).then((hash) => {
			console.log("name saved");
			res.send("name saved");
		});
	});
});

app.get('/saveroomtype', function(req, res)
{
	roomtypesDB.insert(req.query, function (err, newDoc){
		console.log(err);
		res.send("ok");
	});
});

app.get('/getroomtypes', function(req, res)
{
	roomtypesDB.find({}, function (err, docs){
		res.send(docs);
	});

});

app.get('/removeroomtype', function(req, res){

	console.log(req.query._id);
	roomtypesDB.remove({ _id : req.query._id  }, {}, function (err, numRemoved) {
  		res.send("ok");
	});
});

app.get('/gethotelinfo', function(req, res)
{
	hotelinfoDB.findOne({}, function(err, document){
		res.send(document);
	});
});

app.get('/savehotelinfo', function(req, res)
{
	hotelinfoDB.update({ _id : req.query._id }, req.query,function (err, newDoc)
	{
		res.send("ok");
	});
});

app.get('/inserthotelinfo', function(req, res)
{
	hotelinfoDB.insert(req.query, function (err, newDoc)
	{
		res.send("ok");
	});
});


//===========================

app.get('/getpriceplanbyroomtype', function(req, res)
{
	priceplanDB.find({}, function (err, docs){
		res.send(docs);
	});
});

app.get('/savepriceplan', function(req, res)
{
	priceplanDB.insert(req.query, function (err, newDoc)
	{
		res.send("ok");
	});
});

app.get('/deletepriceplan', function(req, res)
{
	priceplanDB.remove({ _id : req.query._id  }, {}, function (err, numRemoved) {
  		res.send("ok");
	});
});

app.get('/publishRoomtype', function(req, res)
{

	

	
});

//===========================

app.get('/updatehotelinfo', function(req, res){

});

app.get('/publishhotelinfo', function(req, res){
	
});

app.get('/hotelinfo', function(req, res){
	res.sendFile(__dirname + "/hotelinfo.html");
});

app.get('/roomtypes', function(req, res){
	res.sendFile(__dirname + "/roomtypes.html");
});

app.get('/priceplan', function(req, res){
	pricePlanId = req.params.id;
	res.sendFile(__dirname + "/priceplan.html");
});


app.get('/bookings', function(req, res){
	pricePlanId = req.params.id;
	res.sendFile(__dirname + "/bookings.html");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
