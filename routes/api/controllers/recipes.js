import express from 'express'
import models from '././models.js'

const router = express.Router()

/*
GET /
    * function: retrives all recipes in mongodb 
    * sends: json of sl
    * error: json errors  
*/
router.get('/', async (req, res) => {
  try{
    let allRecipes = await req.models.Recipe.find()
    res.json(allRecipes)
   } 
   catch(error){
        console.log(`Error retrieving all recipes: ${error}`)
        res.status(500).json({ status: "error", error: error })
    }
})

/*
GET /:id
    * function: retrives a specific recipes in mongodb 
    * sends: json of selected recipe
    * error: json errors  
*/
router.get('/:id', async (req, res) => {
    try {
        const recipeId = req.params.id
        const recipe = await req.models.Recipe.findById(recipeId)
    
        if (!recipe) {
          return res.status(404).json({ status: "error", error: "Recipe not found" })
        }
        res.json(recipe)
      } 
      catch (error) {
            console.log(`Error retrieving recipe with ID ${req.params.id}: ${error}`)
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
      } */
      const name = req.body.recipeName
      const desc = req.body.recipeDescription
      const owner = req.body.username
      const ingredients = req.body.recipeIngredients
      const instructions = req.body.recipeInstructions
      if(req.body.image){  const image = req.body.image  }

      const newRecipe = new models.Recipe({
        recipeName: name,
        recipeDescription: desc,
        recipeOwner: owner,
        recipePrivacy: 'Public',
        recipeIngredients: ingredients,
        recipeInstructions: instructions,
        image: image ? image : ""
      })

      await newRecipe.save()
      res.json({ status: "success" })
  }
  catch(err){
      console.log(`Error saving new post: ${err}`)
      res.status(500).json({ status: "error", error: err })

  }
})


export default router