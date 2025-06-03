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
        //might be . . .
        // const userId = req.session.account.oid
        const userId = req.session.account.userId
        const user = await models.User.findById(userId);
        //const username = req.session.account.username
        let allUserCookbooks = await models.Cookbook.find({ cookbookOwner: userId })
        //auth users always will have at least one cookbook
        if (user.cookbooks.length === 0) {
            favoritesCookbook = new models.Cookbook({
              cookbookOwner: userId,
              title: "Favorites",
              cookbookPrivacy: "private",
              lists: [],
            });
            await favoritesCookbook.save();
            user.cookbooks.push(favoritesCookbook._id)
            await user.save()
            allUserCookbooks = [favoritesCookbook]
          }
      
        
        res.json({
                status: "loggedin",
                userInfo: {
                    username: req.session.account.username,
                    userEmail: req.session.account.userEmail                   
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