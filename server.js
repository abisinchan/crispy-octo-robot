//configuration----------------------------------------

//import dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

//port
const PORT = 3001;

//express server
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes------------------------------------------------

// GET API ROUTE; request to fetch all notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json('Error reading notes data');
    } else {
      const notes = JSON.parse(data);
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
  const { title, text } = req.body;
  if (title && text) {
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
        parsedNotes.push(newPost);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
              return res.status(500).json('Error writing notes data');
            } else {
              console.info('Successfully updated notes!');
              const response = {
                status: 'success',
                body: newPost,
              };
              console.log(response);
              return res.status(201).json(response);
            }
          }
        );
      }
    });
  } else {
    res.status(400).json('Invalid note data');
  }
});

app.use((req, res) =>
  res.status(404).sendFile(path.join(__dirname, '/public/404.html'))
);

//start server ----------------------------------------------
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
