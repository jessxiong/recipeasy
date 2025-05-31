import mongoose from "mongoose";

const models = {};

await mongoose.connect("mongodb+srv://client:info441clientpassword@recipeasy.zfaslsu.mongodb.net/");

const userSchema = new mongoose.Schema({
    username: String,
    userDescription: String,
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: "Recipe"}],
    recipeAllergens: [String]

});

models.User = mongoose.model('User', userSchema);

const recipeSchema = new mongoose.Schema({
    recipeName: String,
    recipeDescription: String,
    recipeIngredients: [String],
    recipeOwner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    recipePrivacy: String,
    recipeInstructions: String,
    recipeAllergens: [String],
    views: Number,
    likes: Number,
    comments: [String],
    image: String
});

models.Recipe = mongoose.model('Recipe', recipeSchema);

const cookbookSchema = new mongoose.Schema({
    cookbookOwner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: String,
    description: String,
    cookbookPrivacy: String,
    lists: [{
        listName: String,
        listPrivacy: String,
        recipes: [{type: mongoose.Schema.Types.ObjectId, ref: "Recipe"}]
    }]
});

models.Cookbook = mongoose.model('Cookbook', cookbookSchema);

// Future Implementation:

// const ingredientSchema = new mongoose.Schema({
//     ingredientName: String,
//     category: String,
//     description: String,
//     allergens: [String],
//     image: String
// });

// models.Ingredient = mongoose.model('Ingredient', ingredientSchema);

console.log("successfully connected to mongodb");

export default models;