import mongoose from "mongoose";

const models = {};

await mongoose.connect("mongodb+srv://client:info441clientpassword@recipeasy.zfaslsu.mongodb.net/");

const userSchema = new mongoose.Schema({
    username: String,
    userDescription: String,
    cookbooks: [{type: mongoose.Schema.Types.ObjectId, ref: "Cookbook"}],
    allergens: [String]

});

models.User = mongoose.model('User', userSchema);

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    text: String,
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  });
  
  models.Comment = mongoose.model("Comment", commentSchema);

const recipeSchema = new mongoose.Schema({
    recipeName: String,
    recipeDescription: String,
    recipeIngredients: [String],
    recipeOwner: String,
    recipePrivacy: String,
    recipeInstructions: String,
    recipeAllergens: [String]
});

models.Recipe = mongoose.model('Recipe', recipeSchema);

const cookbookSchema = new mongoose.Schema({
    cookbookOwner: String,
    title: String,
    description: String,
    cookbookPrivacy: String,
    cookbookRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: "Recipe"}]
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