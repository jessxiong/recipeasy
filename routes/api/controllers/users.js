import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
    try{
        if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "not logged in" })
        }
        const username = req.session.account.username
        let userInfo = await models.User.findOne({username})
        //in case user has no userInfo obj yet
        if(!userInfo){
            userInfo = new models.User({username: username})
            await userInfo.save()
        }
        res.json(userInfo)
    }
    catch(error){
        console.log(`Error retrieving user: ${error}`)
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
        if(req.session.isAuthenticated){ 
            const reqUsername = req.session.account.username
            const reqDescription = req.body.userDescription
            const reqAllergies = req.body.userAllergies

            //auth users always will have at least one cookbook
            favoritesCookbook = new models.Cookbook({
              cookbookOwner: userId,
              title: "Favorites",
              cookbookPrivacy: "private",
              lists: [],
            });
            
            await favoritesCookbook.save();
      
            if (req.session.username !== reqUsername) {
                return res.status(403).json({ error: "Unauthorized to update this user" });
              }

              let updatedUserInfo = await models.UserInfo.findOneAndUpdate(
                { username: reqUsername },
                { userDescription: reqDescription, 
                cookbooks: [favoritesCookbook],
                allergens: reqAllergies },
                { new: true, upsert: true }
            );
            await updatedUserInfo.save()

            res.json({ status: "success", updatedUserInfo})
        } 
        else {
            return res.status(401).json({status: "error", error: "not logged in"})
        }
    }
    catch(error){
        console.log(`Error posting and updating user information: ${error}`)
        res.status(500).json({ status: "error", error: error })

    }
})

/*
GET user
    * function: retrives info about logged in users 
    * returns: username + user info
    * error: json errors  
*/
//DELETE THIS COMMENT IN FINAL: test out with api call on local host - http://localhost:3000/api/users/userInfo
router.get('/userInfo', async function(req, res) {
    try{ 
         //user must be logged in
         if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "Not logged in" })
        }
      
         const userId = req.session.account.oid
        //const userId = req.session.account.userId
        //const user = await models.User.findById(userId);
        //const username = req.session.account.username

        const allUserCookbooks = await models.Cookbook.find({cookbookOwner: userId})
        if(!allUserCookbooks){
            console.log("error retrieving users cookbooks or no users cookbooks")
         }
        
        res.json({
                status: "loggedin",
                userInfo: {
                    username: req.session.account.username,
                    userId: userId                  
                },
                userCookbooks: user.cookbooks
        })
    
    }
    catch(error){ 
        console.log("Error getting user information: ", error)
        res.status(500).json({status: "server error"}) 
    }
});

export default router