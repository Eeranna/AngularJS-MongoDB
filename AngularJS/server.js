// modules =================================================
var express = require('express');
var app = express();
// get all data/stuff of the body (POST) parameters
// parse application/json 
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// configuration ===========================================
// connect to our mongoDB database 
var mongojs = require('mongojs');
var db = mongojs('AddressBook', ['Persons']);
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname));
//Service call for list users
app.get('/persons', function(req, res){
	//console.log('Received find all persons request');
	db.Persons.find(function(err, docs){
		//console.log(docs);
		res.json(docs);
	})
});
app.get('/person/:id', function(req, res){
	//console.log('Received findOne person request');
	db.Persons.findOne({_id: new mongojs.ObjectId(req.params.id)}, function(err, docs){
		//console.log(docs);
		res.json(docs);
	})
});
app.post('/addPerson', function(req, res){
	//console.log(req.body);
	db.Persons.insert(req.body, function(docs){
		//console.log(docs);
		res.json(docs);
	})
});

app.delete('/deletePerson/:id', function(req, res){
	//console.log("Received delete one person request...");
	db.Persons.remove({_id: new mongojs.ObjectId(req.params.id)}, function(err, docs){
		//console.log(docs);
		res.json(docs);
	});
});

app.put('/updatePerson', function(req, res){
	//console.log("Received updatePerson request");
	db.Persons.findAndModify({query: {"_id": new mongojs.ObjectId(req.body._id)}, 
				update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}}
										}, function(err, docs){
											//console.log(docs);
											res.json(docs);
										})
	});
// start app ===============================================
// startup our app at http://localhost:8080
//app.use(express.static(__dirname + "/app/views"));
app.listen(3000);
console.log("server running on port 3000");