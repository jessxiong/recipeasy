import express from "express";
import models from "../../../models.js";

const router = express.Router();
/*
GET /
    * function: retrieves all public cookbooks
    * returns: json of public cookbooks
    * error: json errors  
*/
router.get("/", async (req, res) => {
  try {
    const query = { cookbookPrivacy: "Public" };
    
    // if user is logged in, also get their private cookbooks
    if (req.session.isAuthenticated) {
      query.$or = [
        { cookbookPrivacy: "Public" },
        { 
          cookbookPrivacy: "Private",
          cookbookOwner: req.session.account.username 
        }
      ];
    }
    const allCookbooks = await models.Cookbook.find(query);

    //await models.Cookbook.find({cookbookPrivacy: "public"}).select("title lists") - less info displayed?
    // console.log(`Success retrieval of all public cookbooks: ${allCookbooks}`)
    res.json(allCookbooks);
  } catch (error) {
    console.log(`Error retrieving all public cookbooks: ${error}`);
    res.status(500).json({ status: "error", error: error });
  }
});

/*
GET /
    * function: 
    * returns: 
    * error: 
*/
router.get("/:id", async (req, res) => {
  try {
    const cookbookId = req.params.id
    const cookbook = await req.models.Cookbook.findById(cookbookId)

    // Check if cookbook is private and user doesn't own it
    if (cookbook.cookbookPrivacy === "Private" && (!req.session.isAuthenticated || 
       cookbook.cookbookOwner !== req.session.account.username)) {
      return res.status(403).json({ status: "error", error: "Access denied" });
    }

    res.json(cookbook);
  } catch (error) {
    console.log(`Error retrieving cookbook with ID ${req.params.id}: ${error}`)
    res.status(500).json({ status: "error", error: error })
  }
});

/*
 DELETE IF users/userInfo works well!!!!
GET /myCookbooks
    * function: finds all recipes for given userId
    * returns: json of users cookbook
    * error: json errors  

router.get("/myCookbooks", async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(401).json({ status: "error", error: "not logged in" });
    }
    const username = req.session.account.username;
    let userCookbooks = await models.Cookbook.find({ cookbookOwner: username });

    //logged in users will always have at least one cookbook
    if (userCookbooks.length === 0) {
      userCookbooks = new models.Cookbook({
        cookbookOwner: username,
        title: "Favorites",
        cookbookPrivacy: "private",
        lists: [],
      });
      await userCookbooks.save();
    }

    console.log(`Success retrieval of ${username} cookbooks: ${userCookbooks}`);
    res.json(userCookbooks);
  } catch (error) {
    console.log(`Error retrieving username ${username} cookbooks: ${error}`);
    res.status(500).json({ status: "error", error: error });
  }
}); */

/*
POST cookbook 
    * function: creates + saves new cookbook object to db
    * returns: json status
*/
router.post("/", async (req, res) => {
  try {
    //user must be logged in
    if (!req.session.isAuthenticated) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    
    const username = req.session.account.username
    const title = req.body.cookbookTitle;
    const description = req.body.cookbookDescription;
    const privacy = req.body.cookbookPrivacy;

    let newCookbook = new models.Cookbook({
      cookbookOwner: username,
      title: title,
      description: description,
      cookbookPrivacy: privacy,
      cookbookRecipes: []
    });

    console.log(newCookbook);

    await newCookbook.save();
    return res.status(201).json({ message: "Cookbook added", newCookbook });
  } catch (error) {
    console.log(`Error creeating new Cookbook: ${error}`);
    res.status(500).json({ status: "error", error: error });
  }
});

/*
POST /addRecipe
    * function: adds new recipe to a user's cookbook
    * returns: json status
*/
router.post("/addRecipe", async (req, res) => {
  try {
    //user must be logged in
    if (!req.session.isAuthenticated) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const userId = req.session.account.username;
    const cookbookId = req.body.cookbookId;
    const recipeId = req.body.recipeId;

    const cookbook = await models.Cookbook.findById(cookbookId);

    //ensures cookbook exists
    if (!cookbook) {
      return res
        .status(404)
        .json({
          status: "error",
          error: "Could not find Cookbook to add Recipe",
        });
    }

    //only the user who owns the cookbook can add new recipes to it
    if (cookbook.cookbookOwner.toString() != userId) {
      return res
        .status(400)
        .json({
          status: "error",
          error: "Can't add new recipes to another user's cookbook",
        });
    }

    //edge case if first recipe added to cookbook
    if (!cookbook.cookbookRecipes || cookbook.cookbookRecipes.length === 0) {
      cookbook.lists = [];
    }

    //adds recipe to top of cookbooks
    cookbook.cookbookRecipes.push(recipeId);
    await cookbook.save();
    res
      .status(200)
      .json({ status: "success", message: "recipe added to cookbook" });
  } catch (error) {
    console.log(`Error adding recipe to Cookbook: ${error}`);
    res.status(500).json({ status: "error", error: error });
  }
});

export default router;
