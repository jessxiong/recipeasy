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

    // sources:
    // where i learned i could use mongodb query objects: https://www.w3schools.com/nodejs/nodejs_mongodb_query.asp
    // i learned how to query with mongodb in info430

    let recipeFilter = {};
    
    const {ingredients, allergens, privacy, searchQuery, ids} = req.query;
    

    if (ids) {
      const idArray = Array.isArray(ids) ? ids : [ids];
      recipeFilter._id = { $in: idArray };
    }

    if (ingredients) {
      let ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
      recipeFilter.recipeIngredients = { 
        $all: ingredientsArray.map((ingredient) => (
          {$elemMatch:  {$regex: ingredient, $options: 'i'}}
        ))} 
      }
    
     if (allergens) {
      let allergensArray = Array.isArray(allergens) ? allergens : [allergens];
      recipeFilter.recipeAllergens = { $nin: allergensArray.map((allergen) => (
          {$elemMatch:  {$regex: allergen, $options: 'i'}}
        ))}
      }

    if (privacy) { 
      recipeFilter.recipePrivacy = privacy;
    }

    if (searchQuery) {

      // found on stack overflow to remove emojis
      let sanitized = searchQuery.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
      
      // any special characters
      sanitized = sanitized.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // case insensitive
      recipeFilter.recipeName = { $regex: sanitized, $options: 'i' };
    }

    if (privacy) {
      recipeFilter.recipePrivacy = privacy.toLowerCase();
    } else {
      if (req.session?.isAuthenticated && req.session.account?.username) {
        recipeFilter.$or = [
          { recipePrivacy: "public" },
          { 
            recipePrivacy: "private",
            recipeOwner: req.session.account.username 
          }
        ];
      } else {
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

        // only show private recipe if user owns it
        if (recipe.recipePrivacy === "private") {
          if (!req.session?.isAuthenticated || 
              req.session.account?.username !== recipe.recipeOwner) {
            return res.status(403).json({ 
              status: "error", 
              error: "You don't have permission to view this recipe" 
            });
          }
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

      //only logged in users can post
      if(!req.session.isAuthenticated){
          return res.status(401).json({status: "error", error: "not logged in"})
      }

      const name = req.body.recipeName
      const desc = req.body.recipeDescription
      const owner = req.session.account.username
      const ingredients = req.body.recipeIngredients
      const recipeAllergens = req.body.recipeAllergens || []
      const recipePrivacy = req.body.recipePrivacy
      const instructions = req.body.recipeInstructions

      const newRecipe = new models.Recipe({
        recipeName: name,
        recipeDescription: desc,
        recipeOwner: owner,
        recipePrivacy: recipePrivacy,
        recipeIngredients: ingredients,
        recipeInstructions: instructions,
        recipeAllergens: recipeAllergens,
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