# recipEASY
By: Jocelyn Margarones, Alexia Chan, Renee Singh, Jessica Xiong

## Render Deployment:
https://recipeasy-y11k.onrender.com/

## Project Description
### Who is our target audience?
Our project is targeted towards anyone who relies on recipes to cook—whether they are cooking enthusiasts, individuals trying to cut back on dining out, or busy people who often forget what ingredients they have on hand. We set out to build an application that helps users keep track of the items in their pantry and discover recipes they can make with those ingredients. Sometimes, deciding what to eat can be time-consuming and stressful, particularly for students or working professionals with busy schedules. Our app simplifies this decision-making process, making it easier to maintain consistent and healthy eating habits.

We also aimed to foster a sense of community by allowing users to share and explore recipes posted by others. This feature is especially beneficial for college students or young adults living on their own for the first time, who may be new to cooking. By browsing user-submitted recipes, individuals can find inspiration and connect with others who share similar food preferences or dietary needs.

### Why does our audience want to use our application?
Our audience wants to use our application because it simplifies meal planning and makes cooking at home more convenient. By allowing users to input the ingredients they already have, the app helps them identify meals they can prepare without needing to buy additional items. It also introduces them to new recipes without the hassle of searching manually. This not only saves time and money but also reduces food waste by helping users keep track of what’s in their kitchen before it expires. Lastly, the app supports a healthier lifestyle by making it easier to cook at home instead of relying on takeout or processed foods.

### Why do we as developers want to build this application?
As young adults and busy students, we understand the struggles that come with cooking at home, especially when managing school, work, and limited budgets. We’ve all experienced the disappointment that comes with having fresh ingredients go to waste just because we didn’t have the time or inspiration to use them. Or, times where we’ve had one random item in the fridge and no idea what to do with it. As developers, we are motivated by these shared experiences and want to create a solution that helps others reduce waste, save money, and be more organized in the kitchen.
We envision an application that acts as both a practical tool and a source of culinary inspiration. By allowing users to track their ingredients and discover recipes based on what they already have, we remove the stress from daily meal decisions. We also hope to encourage healthier habits by making home-cooked meals more accessible and less intimidating. Ultimately, we aim to build something that empowers users of all skill levels to enjoy cooking.

## Technical Description

### Architectural Diagrams
<img width="791" alt="Screenshot 2025-05-09 at 9 52 53 PM" src="https://github.com/user-attachments/assets/53141f71-bb9c-4f8a-98bb-c1fb3048b191" />

### Data Flow Diagram

![Data Flow Diagram](https://github.com/user-attachments/assets/f4d67039-0b31-44b8-9ad1-b54da2b035b9)

### User Stories 
| Priority | User  |Description |Technical Implementation
|--|--| --|--|
| P0 | As a user |I want to be able to view a database of recipes without having to log in.  | Get all of the recipe data from the database and render them on the homepage.|
| P0 | As a user |I want to be able to add a recipes to the recipe database  as a logged in user. | After authenticating the user, provide a form to submit a recipe with all of the recipe fields, validate the inputs and save it into the recipe database. |
| P0 | As a user |I want to be able to create an account and log into and out of the account. | Use Azure Authentication when users log into authenticate them and enter them into the database.|
| P1 | As a user |I want to be able to search for recipes stored in the database that use specific ingredients in the search bar.| Implement search that queries the MongoDB and displays all of the recipes where something in the ingredients field matches the input. |
| P1 |I want to be able to login and add recipes to my personal cookbook. | Have a “plus” button that allows users to add their recipe to a personal cookbook. This creates a reference in the Cookbooks table with all of the user information and the recipeID. |
| P2 | As a user |I want to be able to choose a specific ingredient that I have and view all recipes that contain that ingredient out of my personal recipe lists/cookbooks.| Filter from the user’s saved recipes by including a search function in the cookbooks page. Use a query on the user’s specific cookbook data to find and display the recipes with an ID that match the specified input. |
| P2 | As a user |I want to be able to filter out a specific ingredient in the case of an allergy or preference.  | Include a filter button on every search function that allows users to input an ingredient to exclude. When querying the recipes, exclude all of those with the input ingredient|
| P2 | As a user |I want to be able to reorder the recipes from highest rated to lowest. | Include a filter button that retrieves the recipes from the database in descending order based on the rating field.|
| P1 | As a user |I want to be able to add a recipe to my favorites list and be able to create/add custom lists for other recipes. | Store favorite recipes in favorites or custom lists by creating or adding to a list by appending the recipe ID to them.|
| P2 | As a user |I want to be able to add recipes to multiple lists/”cookbooks”| Allow the same recipes to be referenced in different cookbooks under the same user’s lists. |
| P2 | As a user |I want to be able to add comments and ratings to recipes.  | Create a collection of comments that are associated with a recipe ID and the user ID that posted it. Store the numeric rating and the comment string. |
| P3 | As a user |I want to be able to create sublists within my current cookbook lists to organize my recipes.| Allow the list of recipes in a cookbook to be nested to also store an array of sublists that contain the title, description, recipe IDs, etc. |
| P3 | As a user |I want to be able to keep track of each ingredient I have and how many I have used/have left depending on which recipes I have made.  | Allow the user to store all of the ingredients they have and the quantity in a table. Each time a recipe is made, the number of ingredients used in that recipe are subtracted from the corresponding table value. |
| P3 | As a user |I want to be able to create private and public lists, where public lists are viewable to all users who view my account. | Include a visibility feature for each cookbook list, where only the ones marked as public are shown and rendered on the public profile. |
| P3 | As a user |I want to be able to create my own recipes and make them public for me and other users to add.  | Include a button that allows users to create their own recipes. This form saves the recipe to the database, keeping track of ingredients, title, instructions, who it was created by, etc. and is marked as public. |

### REST API Endpoints
GET /recipes returns all recipes in database

GET /recipes/ingredient returns recipes given a specific ingredient

GET /recipes/recipeid returns a specific recipe

POST /recipes/add adds new recipe to database

POST /recipes/recipeid/action adds users comments or rating to recipes database

GET /cookbook/userid returns all cookbooks a user has created

POST /cookbook/userid/add adds a new cookbook to a user’s account

PATCH /cookbook/userid/description updates information about the cookbook’s description


GET /user/login  Allows users to log into their account.


POST /user/register  Allows users to register for an account.


GET /user/profile returns Users profile page and information



### Database Schema

User
- userID (int)
- username (string)
- userDescription (string)
- ingredients (array of key-value pairs)
  - ingredient: count
- favorites (array of recipeID)
- allergens (array of strings)

Cookbooks
- userID (int)
- username (string)
- title (string)
- description (string)
- cookbookPrivacy (string with two potential values: public, private)
- lists (array of dictionaries/objects)
  - listTitle: string
  - listPrivacy: (string with two potential values: public, private)
  - recipes: (array of recipeID)

Recipes
- recipeID (int)
- recipeName (string)
- recipeDescription (string)
- recipeOwner (string)
- recipePrivacy (string with two potential values: public, private)
- recipeServings (int)
- recipeIngredients (array of key-value pairs)
  - ingredient: count
- recipeInstructions (string)
- allergens (array of strings)
- views (int)
- likes (int)
- comments (array of strings)
- picture (string)

Ingredients
- userID (int)
- ingredientID (int)
- ingredientName (string)
- category (string)
- description (string)
- allergens (array of strings)
- count (int)
- picture (string, path to img in directory or api)

