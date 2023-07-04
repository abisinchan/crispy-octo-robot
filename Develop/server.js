//----------------Configuration ----------------------------------

// Import Express.js
const express = require('express');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

//Import fs package
const fs = require('fs');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001

// Static middleware pointing to the public folder
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// ------------------ Routes -----------------------
// Create Express.js routes for default '/', '/send' and '/routes' endpoints

app.get('*', (req, res) => res.send('Default GET Route'));

app.get('/notes', (req, res) => res.send('Default GET Route'));

app.get('/api/notes', (req, res) => res.send('Default GET Route'));

// Responds with the body received on the request - Log the request body contents in the server log
app.post('/api/notes', (req, res) => {
//recieving body
  const requestBody = req.body;

 //to be sure console.log to see what we doing
  console.log('Request body:', requestBody); // Log the request body


  res.json(requestBody);  // Return a response
});

app.delete('/remove', (req, res) => res.send("Delete ROUTE was hit"));

app.put('/change', (req, res) => res.send("PUT ROUTE was hit"));


// ------------------ Start Server -----------------------



// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);


