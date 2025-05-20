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

        if(req.session.isAuthenticated){
            res.json({
                status: "loggedin",
                userInfo: {
                    username: req.session.account.username,
                    userEmail: req.session.account.userEmail,                    
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

export default router