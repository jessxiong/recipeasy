import mongoose from "mongoose";

const models = {};

await mongoose.connect("mongodb+srv://client:info441clientpassword@recipeasy.zfaslsu.mongodb.net/");

const userSchema = new mongoose.Schema({
    username: String,
    userDescription: String,
    ingredients: {type: Map, of: Number, required: true},
    favorites: {type: mongoose.Schema.Types.ObjectId, ref: "Recipe"},
    allergens: [String]

});

models.User = mongoose.model('User', userSchema);

const ingredientSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ingredientName: String,
    category: String,
    description: String,
    allergens: [String],
    count: Number,
    image: String
});

models.Ingredient = mongoose.model('Ingredient', ingredientSchema);

const recipeSchema = new mongoose.Schema({
    recipeName: String,
    recipeDescription: String,
    recipeOwner: {type: mongoose.Schema.Types.username, ref: "User"},
    recipePrivacy: String,
    recipeIngredients: {type: Map, of: Number, required: true},
    recipeInstructions: String,
    allergens: [String],
    views: Number,
    likes: Number,
    comments: [String],
    image: String

});

models.Recipe = mongoose.model('Recipe', recipeSchema);

const cookbookSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    username: {type: mongoose.Schema.Types.username, ref: "User"},
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

console.log("successfully connected to mongodb");

export default models;