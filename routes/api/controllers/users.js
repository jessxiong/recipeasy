import express from 'express'
const router = express.Router()

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

        const username = req.session.account.username

        //auth users always will have at least one cookbook
        //one of these two lines of code should work, I'm not positive which though!
        //let allUserCookbooks = await models.Cookbook.findAll({cookbookOwner: username})
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