import express from 'express'
const router = express.Router()

/*
GET user
    * function: retrives info about logged in users 
    * returns: username + user info
    * error: json errors  
*/
router.get('/userInfo', async function(req, res) {
    try{ 
         //user must be logged in
         if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "Not logged in" })
        }

        const username = req.session.account.username

        //auth users always will have at least one cookbook
        let allUserCookbooks = await models.Cookbook.findAll({username})
        if (!allUserCookbooks) {
            allUserCookbooks = new models.Cookbook({
              cookbookOwner: username,
              title: "Favorites",
              cookbookPrivacy: "private",
              lists: [],
            });
            await allUserCookbooks.save();
          }
      
        
        res.json({
                status: "loggedin",
                userInfo: {
                    username: req.session.account.username,
                    userEmail: req.session.account.userEmail,                    
                },
                userCookbooks: allUserCookbooks
        })
    
    }
    catch(error){ 
        console.log("Error getting user information: ", error)
        res.status(500).json({status: "server error"}) 
    }
});

export default router