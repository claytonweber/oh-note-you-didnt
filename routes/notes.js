const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');


// GET route to get notes
//localhost:3001/api  <-- method is get
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//localhost:3001/notes/  <-- method is post
notes.post('/', (req, res) => {

  const { title, text } = req.body;

  if (req.body) {
    const createNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(createNote, './db/db.json');
    res.json(createNote);
  } else {
    res.error('Error creating note');
  }
});

notes.delete('/:id', (req, res) => {
  
  const noteId = req.params.id;

  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteId);
      writeToFile('./db/db.json', result);
      res.json(`Note deleted!`);
    });
});

module.exports = notes;