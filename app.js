var port = process.env.PORT || 25564;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://admin:admin@ds119618.mlab.com:19618/todoapplication');

// DB Schemas
var item = mongoose.Schema({
    item: String
});

// 	col var                     col name schema
var itemSchema = mongoose.model('Items', item);

/* === Create a document === 
	var name = "test item " + i;

	var testItem = new itemSchema({ item : name });

	testItem.save(function (err, obj) {
	  if (err) return console.error(err);
	  console.log("Sucess " + i);
	});

*/

/* === Querying A DB ===
var query = itemSchema.find({});

query.exec(function (err, result) {
  if (err) return handleError(err);
  console.log(result);
})
*/

var getAll = itemSchema.find({});

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({    
  extended: true
})); 

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {

	var arr = [];

	getAll.exec(function(err, result) {
		
		if (err) console.log(err);

		for (var i = 0; i < result.length; i++) {
			arr.push(result[i].item);
		}

		res.render('index', { 'list' : arr });
	});

});

app.post('/', function(req, res) {
	
	var item = req.body.content;

	var arr = [];
	
	var newItem = new itemSchema({ item : item });

	newItem.save(function (err, obj) {
		if (err) return console.error(err);
	  
		getAll.exec(function(err, result) {
			if (err) console.log(err);

			for (var i = 0; i < result.length; i++) {
				arr.push(result[i].item);
			}

			res.send("Sucess");
		});
	});
});

app.delete('/', function(req, res) {

	var index = req.body.index;

	getAll.exec(function(err, result) {
		if (err) console.log(err);

		for (var i = 0; i < result.length; i++) {
			if (i == index) {
				result[i].remove(function(err) {
					if (err) console.log(err);

					getAll.exec(function(err, result) {
						if (err) console.log(err);

						var list = [];

						for (var i = 0; i < result.length; i++) {
							list.push(result[i].item);
						}

						res.send("Sucess");

					});
				});
			}
		}

	});
});


app.get('*', function(req, res) {
	res.send('404');
});

var server = app.listen(port, function() {
	console.log("Server started!");
	console.log(server.address());
});