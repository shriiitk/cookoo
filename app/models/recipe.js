// load mongoose since we need it to define a model
var mongoose = require('mongoose');

// module.exports = mongoose.model('Tag', {
// 	title	: { type: String, required: true, unique: true, trim: true, uppercase: true, }
// });

module.exports = mongoose.model('Recipe', {
	title			: { type: String, required: true, unique: true, trim: true },
	tags			: [String],
	url				: String,
	video			: String,
	instructions	: String,
	createdOn		: Date,
	modifiedOn		: Date
});