import express from 'express'
const router = express.Router()

/*
GET /
    * function: retrives all recipes in mongodb 
    * sends: html that displays cards of all recipes
    * error: json errors  
*/
router.get('/', async (req, res) => {
  try{
    console.log("gets all recipes")
   } 
   catch(error){
        console.log(`Error retrieving all recipes: ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})


/*
POST /
    * function: saves new recipes object in mongodb w/recipeName, ingredients, instructions, created date
    * returns: json status i.e {"status": "success"} or  {"status": "error", "error": error}
*/
router.post('/', async (req, res) => {
  try{
      /*
      //only logged in users can post
      if(!req.session.isAuthenticated){
          return res.status(401).json({status: "error", error: "not logged in"})
      }
      
    

      const newRecipe = new models.???({
         
      })

      await newRecipe.save()*/
      res.json({ status: "success" })
  }
  catch(err){
      console.log(`Error saving new post: ${err}`)
      res.status(500).json({ status: "error", error: err })

  }
})

/*
GET /ingredient
    * function: retrives all recipes with query ingredient in mongodb 
    * sends: html that displays cards of all recipes with query ingredient
    * error: json errors  
*/
router.get('/ingredient', async (req, res) => {
  try{
    console.log("gets all recipes with given ingredient")
   } 
   catch(error){
        console.log(`Error retrieving recipes with ingredient $. . . : ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})




export default router