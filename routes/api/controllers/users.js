import express from 'express';
import models from "../../../models.js";

var router = express.Router();


/* GET info about logged in user */
router.get('/userInfo', async function(req, res) {
    try{ 
        //gets json info belonging to authenticated users
        if(req.session.isAuthenticated){
            res.json({
                status: "loggedin",
                userInfo: {
                    name: req.session.account.name,
                    username: req.session.account.username,
                }
            })
        }
        else{ //loggedout user gets no info returned
            res.json({status: "loggedout"})
        }
    }
    catch(error){ 
        console.log("Error getting user information", error)
        res.status(500).json({status: "server error"}) 
    }
});

/* 
GET user
    * function: retrives metadata from mongodb about requested user 
    * returns: json of user info or error 
*/
router.get('/', async (req, res) => {
    try{
        if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "not logged in" })
        }
        const username = req.body.username
        let userInfo = await models.User.findOne({username})
        if(!userInfo){
            userInfo = new models.User({
                username: userInfo.username,
             })
            await userInfo.save()
        }
        res.json(userInfo)
    }
    catch(error){
        console.log(`Error retrieving user info: ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})

/*
POST posts 
    * function: creates + saves new userInfo object to db
    * returns: json status
*/
router.post('/', async (req, res) => {
    try{ 
        //user must be logged in
        if(!req.session.isAuthenticated){ 
            return res.status(401).json({status: "error", error: "not logged in"})
        }

        const reqUsername = req.body.username
        if (req.session.username !== reqUsername) {
            return res.status(403).json({ error: "Unauthorized to update this user" });
        }

        const reqDesc = req.body.userDescription
        const reqAllergens = req.body.allergens
        const reqCookbooks = req.body.cookbooks

        if(!reqCookbooks){
            let favorites = new models.Cookbook({
                title: "Favorites",
                description: "",
                cookbookPrivacy: "private",
                cookbookRecipes: [],
                cookbookOwner: username
              });

              await favorites.save()
        }

        let updatedUserInfo = await models.UserInfo.findOneAndUpdate(
            { username: reqUsername },
            {   userDescription: reqDesc,
                cookbooks: reqCookbooks || favorites,
                allergens:reqAllergens  },
            { new: true, upsert: true } 
        );
        await updatedUserInfo.save()
    
        res.json({ status: "success", updatedUserInfo})
    }
    catch(error){
        console.log(`Error updating user information: ${error}`)
        res.status(500).json({ status: "error", error: error })

    }
})

export default router;