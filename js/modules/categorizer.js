/**
	@author: Amol Kapoor
	@date: 5-24-16

	Description: Module to take in a list of emails, returning a list of categories. 

	NOTE: Can be approved with ML. See tensorflow?

	Requires: Category
*/

/**
	Basic version of category finder. Categorizes all senders that appear and sorts by most common. 
	Returns list of senders as categories.

	@param: emails; [Email]; list of emails to find categories from 
	@return: [Category] sorted by most common sender
*/
function runCategoryFinder(emails) {

	var userObj = {};

	for(var i in emails) {
		var email = emails[i];
		for(var user in email.usersFrom) {
			if(userObj[user])
				userObj[user]++;
			else
				userObj[user] = 1;
		}
	}

	var userList = Object.keys(userObj).sort(function(a,b){return userObj[b]-userObj[a]})

	var categoryList = [];

	for(var i = 0; i < userList.length; i++) {
		categoryList.push(new Category({'data':userList[i]}));
	}

	return categoryList;
}

/**
	@param: email; Email; the email to parse for categorization
	@param: categories; [Category]; a list of possible categories
	@return: [string] a list of categories this email falls under
*/
function runCategoryParser(email, categories) {

	var relevantCategories = [];

	for(var index in categories) {
		var category = categories[index];

		if(category.match(email)) {
			relevantCategories.push(category);
		}
	}
	

	return relevantCategories;
}

/**
	@param: email; Email; the email to add categories to
	@param: categories; [Category]; a list of possible categories
*/
function findCategoriesAndAddToEmail(email, categories) {
	email.categories = runCategoryParser(email, categories);
}

/**
	@param: emails; [Email]; list of emails to categorize
	@param: categories; [Category]; a list of possible categories
*/
function findCategoriesAndAddToEmails(emails, categories) {
	for(var index in emails) {
		findCategoriesAndAddToEmail(emails[index], categories);
	}
}