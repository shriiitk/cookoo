// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var tagSchema = mongoose.Schema({
    title   : { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        uppercase: true
    }
});

module.exports = mongoose.model('Tag', tagSchema);