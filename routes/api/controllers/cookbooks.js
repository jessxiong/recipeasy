import express from 'express'
import models from '../../../models.js';

const router = express.Router()

/*
GET 
    * function: finds all recipes for given userId
    * returns: json of users cookbook
    * error: json errors  
*/
router.get('/', async (req, res) => {
    try{
        if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "not logged in" })
        }
        const username = req.body.username
        let userCookbooks = await models.Cookbook.findAll({username})
        
        //logged in users will always have at least one cookbook
        if(!userCookbooks){
            userCookbooks = new models.Cookbook({
                cookbookOwner: username, 
                title: "Favorites",
                cookbookPrivacy: "private" })
            await userCookbooks.save()
        }

        console.log(`Sucess retrieval of ${username} cookbooks: ${userCookbooks}`)
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
                cookbookOwner: userId,
                title: title,
                description: description,
                privacy: privacy
            })

            await newCookbook.save()
            return res.status(201).json({ message: "Cookbook added", newCookbook });
        }
        else{
            return res.status(401).json({ status: "error", error: "Not logged in" })
        }
    }
    catch(error){
        console.log(`Error creeating new Cookbook: ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})




export default router

