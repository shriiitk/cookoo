// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');

// create our schema
var recipeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tags: [String],
    url: String,
    video: String,
    instructions: String,
    createdOn: Date,
    modifiedOn: Date
});

// give our schema text search capabilities
recipeSchema.plugin(textSearch);

// add a text index to the tags array
recipeSchema.index({
    title		: "text",
    tags		: "text",
    instructions: "text",
    chef        : "text"
}, {
    weights: {
        title		: 10,
        tags		: 5,
        instructions: 1,
        chef        : 1
    },
    name: "RecipeTextIndexWithChef"
});

module.exports = mongoose.model('Recipe', recipeSchema);

/*
db.recipes.ensureIndex(
 {
   title    : "text",
    tags    : "text",
    instructions: "text",
    chef    : "text"
 },
 {
   weights: {
        title   : 10,
        tags    : 5,
        instructions: 1,
        chef        : 1
            },
   name: "RecipeTextIndexWithChef"
 }
);
 */
