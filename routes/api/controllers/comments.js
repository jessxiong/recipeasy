import express from "express";
const router = express.Router();
import models from "../../../models.js";

const { Recipe, Comment } = models;

router.get("/", async (req, res) => {
  try {
    const { recipeID } = req.query;

    if (!recipeID) {
      return res.status(400).json({ status: "error", error: "Missing recipeID parameter" });
    }

    const comments = await Comment.find({ recipe: recipeID }).exec();
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post('/', async (req, res) => {

    try {

        if(!req.session.isAuthenticated){ 
            return res.status(401).json({ status: "error", error: "not logged in" })
        }

      const { text, rating, recipeID } = req.body;
      const Comment = req.models.Comment;
  
      const comment = new Comment({
        username: req.session.account.username,
        text,
        rating,
        recipe: recipeID,
        created_date: new Date()
      });
  
      await comment.save();
      res.json({ status: 'success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', error: error.message });
    }
  });
 
export default router;
