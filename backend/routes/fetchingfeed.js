const express = require('express');
const router = express.Router();
const checklogin = require('../middleware/checklogin');
const Notes = require('../models/loginfeed');
const { body, validationResult } = require('express-validator');
const { ResultWithContextImpl } = require('express-validator/src/chain');

//router for getting notes of the user

router.get('/arcane_feed',checklogin, async (req, res) => {
    if(!req.user){
        // console.log(req.user);
        // res.send('sucess')
        const feed=await Notes.find().sort({"Date": -1}).limit(4)
        res.send(feed)

    }
    else{
        console.log(req.user);
        // res.send('not_sucess')
        const feed=await Notes.find().sort({"Date": -1})
        res.send(feed)

    }

})
router.get('/tags',checklogin,[
    body('tag', 'enter a valid title').isLength({ min: 1 }),
],async(req,res)=>{
    if(!req.user){
        try{

            const tag=req.body;
            console.log(tag)
            const feed=await Notes.find(tag).sort({"Date": -1}).limit(4)
            if(feed.length===0){
                res.send('no feed found')

            }
            else{

                res.send(feed)
            }
            
            
        }
        catch(error){
            res.status(404).send(error)
        }

    }
    else{
        try{

            const tag=req.body;
            console.log(tag)
            const feed=await Notes.find(tag).sort({"Date": -1})
            console.log(feed.length)
            if(feed.length===0){
                res.send('no feed found')
            }
            else{

                res.send(feed)
            }
            
            
        }
        catch(error){
            res.status(404).send(error)
        }

    }


})
module.exports = router;