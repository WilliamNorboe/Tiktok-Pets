'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,false);
	console.log(winner);

	//winner = await win.computeWinner(8,true);
  // you'll need to send back a more meaningful response here.
  // res.json({});
		//dumpTable()
		getVideoById(winner)
			.then(function(result){
					console.log(result);
					res.json(result);
			})
		
  } catch(err) {
    res.status(500).send(err);
  }
});

// app.get("/getTwoVideos", async function(req, res) {
// 	console.log("Getting Two Video");
// 	let num1 = getRandomInt(7);
// 	let num2 = getRandomInt(7);
// 	while(num1 == num2){
// 		num2 = getRandomInt(7);
// 	}
// 	console.log(num1);
// 	console.log(num2);

// 	getURLS()
// 	.then(function (result){
// 		console.log("Column", result);
// 		// console.log(result[num1].url);
// 		// console.log(result[num2].url);
// 		const videos = [result[num1].url, result[num2].url];
// 		console.log(videos);
// 		res.send(videos);
// 	})
// 	.catch(function(err) {
//       console.log("SQL error",err)} );
// });

app.get("/getTwoVideos", async function(req, res) {
	console.log("Getting Two Video");
	let num1 = getRandomInt(8);
	let num2 = getRandomInt(8);
	while(num1 == num2){
		num2 = getRandomInt(8);
	}

	// for(let i = 0; i < 100; ++i){
	// 	console.log(getRandomInt(8));
	// }
	console.log(num1);
	console.log(num2);

	dumpTable()
	.then(function (result){
		console.log("Column", result);
		// console.log(result[num1].url);
		// console.log(result[num2].url);

		// result[num1].rowIdNum = num1;
		// // debugging may chabge
		// result[num2].rowIdNum = num2;
		
		const videos = [result[num1], result[num2]];
		console.log(videos);
		res.send(videos);
	})
	.catch(function(err) {
      console.log("SQL error",err)} );
});


app.post("/insertPref", (req, res) =>{
	let obj = req.body;
	console.log(obj);

	win.insertPreference(obj.better, obj.worse)
		.then(function(){
				win.getAllPrefs()
			.then(function (result){
				console.log(result);

					getNumPref()
					.then(function(result){
						console.log(result.num);

						if(result.num >= 15){
							res.send("pick winner")
						}
						else{
							res.send("Continue");
						}
						
					})
					.catch(function (error){
						console.log("Error:", error);
					});
				
			});
		})
	.catch(function (error){
		console.log("Error:", error);
	});

});

// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});




// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

async function getURLS(){
	const sql = "SELECT url FROM VideoTable;";
	let result = await db.all(sql);
	return await result;
}

async function dumpTable() {
  const sql = await "select * from VideoTable"
  
  let result = await db.all(sql)
  return await result;
}


async function getVideoById(idNum) {

  // warning! You can only use ? to replace table data, not table name or column name.
  const sql = 'select * from VideoTable where rowIdNum = ?';

	let result = await db.get(sql, [idNum]);
	return result;
}

async function getNumPref() {

	  // warning! You can only use ? to replace table data, not table name or column name.
	
	  const sql = 'SELECT COUNT(*) AS num FROM PrefTable;';
		let result = await db.get(sql);


	return await result;
}
