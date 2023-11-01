const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/loginfeed');
// const Photo = require('../models/photos');
// const uploadMiddleware= require('../middleware/uploadMiddleware');
// const upload = multer({ uploadMiddleware });

const { body, validationResult } = require('express-validator');
const multer = require('multer');

// router.use(express.static(__dirname+"./public"));
// const uploadMiddleware = multer({
  //   dest: './uploads/',
// });
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/'); // Create an 'uploads' directory for storing images
//     },
//     filename: (req, file, cb) => {
//       cb(null, new Date().toISOString() + file.originalname);
//     },
//   });
  const uploadMiddleware = multer({
    dest: './uploads/file/',
});
    const imgupload = multer({ uploadMiddleware });

//router for getting notes of the user

router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        console.log("hii fetching notes working");
        res.json(notes);

    } catch (error) {
        res.status(401).send("unauthorized");

    }

})

//adding notes in the databse 
//THIS Gonna decide ki user nay konsa mode choose kiya hai
router.post('/addingnotes', fetchuser,imgupload.single('file'),[
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 }),
    body('anon').isLength({ max: 3 }),
], async (req, res) => {
    try {
        const { title, description, tag, anon } = req.body;
        console.log(title)
        

        
        // console.log(description)
        //if error return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });

        }
        if (anon === "on") {

            const note = new Notes({
                filename: req.file.filename,
                contentType: req.file.mimetype,
                imageData: req.file.buffer,title, description, tag, user: req.user.id, user_name: "Arcane_04"


            })
            // const photo = new Photo({
            //     filename: req.file.filename,
            //     contentType: req.file.mimetype,
            //     imageData: req.file.buffer,
            //   });
            // console.log(req.user.id)
            const savedNote = await note.save();
            // await photo.save();
            console.log('hello')
            res.json(savedNote)
        }
        if (anon === "of") {

            console.log(req.user)
            const note = new Notes({
                filename: req.file.filename,
                contentType: req.file.mimetype,
                imageData: req.file.buffer,title, description, tag, user: req.user.id, user_name: req.user.username

            })

            const savedNote = await note.save();
            res.json(savedNote)


        }


    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal  error");

    }

})

//updating existing notes using put request
router.put("/update/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send("not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(400).send("not allowed")
        }
        // console.log(newNote);
        noting = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

        res.json({ noting });
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("internal server error")

    }

})

router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("not found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }
        noting = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        res.status(500).send("internal server error");

    }
})

module.exports = router;