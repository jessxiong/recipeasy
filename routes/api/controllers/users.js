import express from 'express'
const router = express.Router()

/*
GET user
    * function: retrives all users in mongodb 
    * returns: json Object array w/ all users
    * error: json errors  
*/
router.get('/', async (req, res) => {
    console.log("get users")
})



export default router