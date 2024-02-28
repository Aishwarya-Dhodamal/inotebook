const express = require("express");

const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Notes = require('../models/Notes');
const { query, validationResult, body } = require('express-validator');

//ROUTE 1: Fetch all notes ...GET "./notes/fetchallnotes" #Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error.message);
    }
})

//ROUTE 2:Add note ...POST "./notes/addnote" #Login required
router.post('/addnote', fetchuser, [body("name", "Enter  a valid title of min 3 characters").isLength({ min: 3 }),
body("description", "Description must be atleast 5 characters").isLength({ min: 5 })], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
    }
    try {

        const notes = await Notes.create({
            user: req.user.id,
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag
        })
        res.json(notes);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error.message);
    }
})

// ROUTE 3: Edit note .../api/notes/editnote ..#Login required

router.put("/editnote/:id", fetchuser, async (req, res) => {
    try {
        var note= await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Data not found")
        }
        if (req.user.id !== note.user.toString()) {
            res.status(401).send("Not Allowed");
        }
        const { title, description, tags } = req.body;
        var newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tags) {
            newNote.tags = tags;
        }
       note = await Notes.findByIdAndUpdate(req.params.id,
            {
                $set: newNote

            }, { new: true })
        res.json({note});


    }
    catch (error) {
        console.log(error);
        res.send({ error: error.message });
    }


})


// ROUTE 4 : Delete notes using "./api/notes/deletenote/:id"  ..#Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        var note= await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Data not found")
        }
        if (req.user.id !== note.user.toString()) {
            res.status(401).send("Not Allowed");
        }
        
       note = await Notes.findByIdAndDelete(req.params.id)
        res.status(202).send("Note is successfully deleted");
        


    }
    catch (error) {
        console.log(error);
        res.send({ error: error.message });
    }


}) 
module.exports = router;