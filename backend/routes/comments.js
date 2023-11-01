const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Comments = require('../models/comments');
const { body, validationResult } = require('express-validator');


router.post('/comments', fetchuser, [
    body('comment', 'enter a comment').isLength({ min: 2 }),
], async (req, res) => {
    try {
        const { comment, post_id } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });

        }
        else {
            const comm = new Comments({ comment, post_id, username_id: req.user.id, user_name: req.user.username })
            const commented = await comm.save();
            res.json(commented)
        }



    }
    catch (error) {
        res.status(500).send("Internal  error");

    }
})
module.exports = router;