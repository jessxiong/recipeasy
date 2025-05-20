import mongoose from "mongoose";

const models = {};

await mongoose.connect("mongodb+srv://client:info441clientpassword@recipeasy.zfaslsu.mongodb.net/");

const userSchema = new mongoose.Schema({
    username: String,
    userEmail: String,
    allergens: [String]
});

models.User = mongoose.model('User', userSchema);

const recipeSchema = new mongoose.Schema({
    recipeName: String,
    recipeDescription: String,
    recipeOwner: {type: mongoose.Schema.Types.username, ref: "User"},
    recipePrivacy: String,
    recipeIngredients: {type: Map, of: Number, required: true},
    recipeInstructions: String, //do we need recipe description and recipe instructions?
   // allergens: [String],
    //likes: Number,
    //comments: [String],
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