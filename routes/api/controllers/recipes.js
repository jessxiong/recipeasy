import express from 'express'
import models from '../../../models.js';

const router = express.Router()

/*
GET /
    * function: retrives all recipes in mongodb 
    * sends: json recipes and their info
    * error: json errors  
*/
router.get('/', async (req, res) => {
  try{

    let recipeFilter = {};

    const {ingredients, allergens, privacy, searchQuery, ids} = req.query;
    console.log(ingredients);
    console.log(allergens);
    console.log(privacy);
    console.log(searchQuery);

    if (ids) {
      const idArray = Array.isArray(ids) ? ids : [ids];
      recipeFilter._id = { $in: idArray };
    }

    if (ingredients) {
      recipeFilter.recipeIngredients = { $all: ingredients }
    }

     if (allergens) {
      recipeFilter.recipeAllergens = { $all: allergens }
    }

    if (privacy) {
      recipeFilter.recipePrivacy = privacy;
    }

    if (searchQuery) {
      recipeFilter.recipeName = searchQuery;
    }

     // 🚨 Correct privacy logic
     if (privacy) {
      // If user is explicitly filtering by privacy (e.g., "private" or "public")
      recipeFilter.recipePrivacy = privacy.toLowerCase();
    } else {
      // Otherwise, show public recipes + user's own private recipes
      if (req.session?.isAuthenticated && req.session.username) {
        const user = await req.models.User.findOne({ username: req.session.username });
        if (user) {
          recipeFilter.$or = [
            { recipePrivacy: "public" },
            { recipePrivacy: "private", recipeOwner: user._id }
          ];
        } else {
          recipeFilter.recipePrivacy = "public"; // fallback if user not found
        }
      } else {
        // Not logged in → only public
        recipeFilter.recipePrivacy = "public";
      }
    }


    let allRecipes = await req.models.Recipe.find(recipeFilter);
    // let previews = await Promise.all(
    //   allRecipes.map(async (recipe) => {
    //     let recipeName = recipe.recipeName;
    //     let recipeIngredients = recipe.recipeIngredients.toString()
    //     let recipeDescription = recipe.recipeDescription;

    //     let preview = `<div>`
    //     if (recipeName) { preview += `<h2>${recipeName}</h2>`}
    //     if (recipeIngredients) { preview += `<p>${recipeIngredients}</p>`}
    //     if (recipeDescription) { preview += `<p>${recipeDescription}</p></div>`}
    //     return {
    //       recipeName: recipeName,
    //       recipeIngredients: recipeIngredients,
    //       recipePreview: preview
    //     }
    //   }
    //   ))
    res.type('json')
    res.send(allRecipes)
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
  console.log("recipe saving...", req.body);
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
      const recipeAllergens = req.body.recipeAllergens || []
      const recipePrivacy = req.body.recipePrivacy
      const instructions = req.body.recipeInstructions
      // let image = req.body.image || ""

      const newRecipe = new models.Recipe({
        recipeName: name,
        recipeDescription: desc,
        recipeOwner: owner,
        recipePrivacy: recipePrivacy,
        recipeIngredients: ingredients,
        recipeInstructions: instructions,
        recipeAllergens: recipeAllergens,
        // image: image,
        // views: 0,
        // likes: 0,
        comments: []
      })
      console.log("Saving recipe:", newRecipe);
      await newRecipe.save()
      res.json({ status: "success" })
  }
  catch(err){
      console.log(`error saving: ${err}`)
      res.status(500).json({ status: "error", error: err })

  }
})


export default router