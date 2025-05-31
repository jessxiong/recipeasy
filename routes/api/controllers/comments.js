import express from 'express';
const router = express.Router();
import models from '../../../models.js';

const { Recipe } = models;

//post /api/comments/:id
//check auth, ratings, and the recipe exists 
router.post('/:id', async (req, res) => {
    try {
        const userId = req.authContext?.account?.homeAccountId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const recipeId = req.params.id;
        const { text, rating } = req.body;

        if (!text || rating == null || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid comment or rating" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        recipe.comments.push({
            user: userId,
            text,
            rating
        });

        await recipe.save();

        return res.status(201).json({ message: "Comment added", recipe });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
