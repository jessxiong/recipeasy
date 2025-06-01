import express from 'express'
import models from '../../../models.js';

const router = express.Router()
/*
GET /
    * function: retrieves all public cookbooks
    * returns: json of public cookbooks
    * error: json errors  
*/
router.get('/', async (req, res) => {
    try{
        const allCookbooks =  await models.Cookbook.find({cookbookPrivacy: "public"})
       //await models.Cookbook.find({cookbookPrivacy: "public"}).select("title lists") - less info displayed?
        console.log(`Success retrieval of all public cookbooks: ${allCookbooks}`)
        res.json(allCookbooks)
    }
    catch(error){
        console.log(`Error retrieving all public cookbooks: ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})

/*
GET /myCookbooks
    * function: finds all recipes for given userId
    * returns: json of users cookbook
    * error: json errors  
*/
router.get('/myCookbooks', async (req, res) => {
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
                cookbookPrivacy: "private",
                lists: [] })
            await userCookbooks.save()
        }

        console.log(`Success retrieval of ${username} cookbooks: ${userCookbooks}`)
        res.json(userCookbooks)
    }
    catch(error){
        console.log(`Error retrieving username ${username} cookbooks: ${error}`)
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

            let newCookbook = new models.Cookbook({
                cookbookOwner: userId,
                title: title,
                description: description,
                cookbookPrivacy: privacy,
                lists: []
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


/*
POST /addRecipe
    * function: adds new recipe to a user's cookbook
    * returns: json status
*/
router.post('/addRecipe', async (req, res) => {
    try{ 
        //user must be logged in
        if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "Not logged in" })
        }
        const userId = req.body.userId
        const cookbookId = req.body.cookbookId
        const recipeId = req.body.recipeId

        const cookbook = await models.Cookbook.findById(cookbookId)

        //ensures cookbook exists
        if(!cookbook){
            return res.status(404).json({ status: "error", error: "Could not find Cookbook to add Recipe" })
        }

        //only the user who owns the cookbook can add new recipes to it
        if(cookbook.cookbookOwner.toString() != userId){
            return res.status(400).json({ status: "error", error: "Can't add new recipes to another user's cookbook" })
        }

        //edge case if first recipe added to cookbook
        if(!cookbook.lists || cookbook.lists.length === 0){
            cookbook.lists = [{
                listPrivacy: cookbook.cookbookPrivacy,
                recipes: []
            }]
        }

        //adds recipe to top of cookbooks
        cookbook.lists[0].recipes.push(recipeId)
        await cookbook.save()
        res.status(200).json({ status: "success", message: "recipe added to cookbook" })
        
    }
    catch(error){
        console.log(`Error adding recipe to Cookbook: ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})

export default router

