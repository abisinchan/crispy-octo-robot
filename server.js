//configuration----------------------------------------

//import dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

//port
const PORT = 3001;

//express application
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes------------------------------------------------

// GET API ROUTE; request to fetch all notes
app.get('/api/notes', (req, res) => {
    //reads db.json
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json('Error reading notes data');
    } else {
      const notes = JSON.parse(data);// Parses the JSON data from 'db.json' into an array
      res.status(200).json(notes);
    }
  });
});

// GET HTML ROUTES
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// POST API ROUTE; request to add a note
app.post('/api/notes', (req, res) => {

//deconstruct
  const { title, text } = req.body;
  if (title && text) {  //is both present?
//create new object
    const newPost = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json('Error reading notes data');
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newPost);// Appends the new note object to the array

        // Writes the updated array back to 'db.json'
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
              return res.status(500).json('Error writing notes data');
            } else {
              console.info('Successfully added new note!');
              const response = {
                status: 'success',
                body: newPost,
              };
              console.log(response);// Logs the response object

              //response with the response object as JSON data
              return res.status(201).json(response);
            }
          }
        );
      }
    });
  } else {
    //if 'title' or 'text' is missing
    res.status(400).json('Invalid note data');
  }
});


// DELETE API ROUTE; request to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;//id' parameter received from user click on trash icon
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json('Error reading notes data');
      } else {
        const parsedNotes = JSON.parse(data);

        // Filters out the note with the specified ID
        const updatedNotes = parsedNotes.filter((note) => note.id !== noteId);
  
        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4), (writeErr) => {// Writes the filtered array back to 'db.json'
          if (writeErr) {
            console.error(writeErr);
            return res.status(500).json('Error writing notes data');
          } else {
            console.info(`Note with ID ${noteId} deleted successfully!`);
            return res.status(200).json({ status: 'success', id: noteId });
          }
        });
      }
    });
  });

//start server ----------------------------------------------
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
