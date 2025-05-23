import express from 'express';
var router = express.Router();

import recipesRouter from './controllers/recipes.js';
import usersRouter from './controllers/users.js';
//import cookbookRouter from './controllers/cookbook'

router.use('/recipes', recipesRouter);
router.use('/users', usersRouter);
//router.use('/cookbook', cookbookRouter);


export default router;