// Dependencies

const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: idGen } = require("uuid");

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/db"));

// Routes

// Basic route that sends the user first to the AJAX Page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// Route for displaying the notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Displays all notes
app.get("/api/notes", (req, res) => {
  let pt = path.join(__dirname, "/db/db.json");
  //console.log("GET");
  fs.readFile(pt, "utf8", (error, data) => {
    if (error) {
      console.error(error);
    }
    //console.log(data);
    res.json(JSON.parse(data));
  });
});

// Create New note - takes in JSON input
app.post("/api/notes", (req, res) => {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  const newNote = req.body;
  // gives the new note a unique id using the uuid library
  // https://www.npmjs.com/package/uuid
  newNote.id = idGen();
  //console.log("POST");
  //console.log(newNote);
  // gets the path for the json note file
  let pt = path.join(__dirname, "/db/db.json");

  //reads the notes in the json file, adds the new note, then responds with the updated json data
  fs.readFile(pt, "utf8", (error, data) => {
    if (error) {
      console.error(error);
    }

    //console.log(data);
    let notes = JSON.parse(data);
    //console.log(notes);
    notes.push(newNote);
    //console.log(notes);
    // writes the new list to the db
    fs.writeFile(pt, JSON.stringify(notes), (err) =>
      err ? console.error(err) : console.log("Success!")
    );
    res.json(notes);
  });
});

// deletes a note of the given id from the notes list
app.delete("/api/notes/:id", (req, res) => {
  let pt = path.join(__dirname, "/db/db.json");
  // gets the id of the note from the url
  let del = req.params.id;
  //console.log("DELETE");
  //console.log(del);
  // uses same basic functionality as the post request
  fs.readFile(pt, "utf8", (error, data) => {
    if (error) {
      console.error(error);
    }

    //console.log(data);
    let notes = JSON.parse(data);
    //console.log(notes);
    // filters the array for all notes that don't have the passed id
    let newNotes = notes.filter((el) => el.id != del);
    //console.log(newNotes);
    fs.writeFile(pt, JSON.stringify(newNotes), (err) =>
      err ? console.error(err) : console.log("Success!")
    );
    res.json(notes);
  });
});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
