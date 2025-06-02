import express from 'express';
var router = express.Router();

import recipesRouter from './controllers/recipes.js';
import usersRouter from './controllers/users.js';
import cookbookRouter from './controllers/cookbooks.js';
import commentRouter from './controllers/comments.js'; 
import userProfileRouter from './controllers/userProfiles.js'; 

router.use('/recipes', recipesRouter);
router.use('/users', usersRouter);
router.use('/cookbook', cookbookRouter);
router.use('/comments', commentRouter)
router.use('/userProfile', userProfileRouter)


export default router;