import express from 'express'
import models from '../../../models.js';

const router = express.Router()

/*
GET 
    * function: finds all recipes for given userId
    * returns: 
    * error: json errors  
*/
router.get('/', async (req, res) => {
   try{
        if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "not logged in" })
        }
        const userId = req.query.userId
        let userCookbooks = await req.models.Cookbook.find({user: userId})
        //if(userId == req.session.username){ }
        res.json(userCookbooks)  
    }
    catch(error){
        console.log(`Error retrieving user info: ${error}`)
         res.status(500).json({ status: "error", error: error })
    }
})

/*
POST cookbook 
    * function: creates + saves new cookbook object to db
    * returns: json status
*/
router.post('/', async (req, res) => {
    try{ 
        //user must be logged in
        if(req.session.isAuthenticated){ 
            const title = req.body.title
            const description = req.body.description
            const userId = req.body.userId
            const privacy = req.body.privacy

            let newCookbook = new req.models.Cookbook({
                title: title,
                description: description,
                cookbookOwner: userId,
                privacy: privacy
            })

            await newCookbook.save()
            res.json({status: "success"})
        }
        else{
            return res.status(401).json({ status: "error", error: "not logged in" })
        }
    }
    catch(error){
        console.log(`Error updating user information: ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})

export default router

