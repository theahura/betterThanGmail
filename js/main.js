/**
	Takes in an object of emails and returns a list sorted by timestamp

	@param: emailList; {Email}; emails to sort
	@return: [Email] sorted by timestamp
*/
function sortEmailsByTimestamp(emailList) {
	return Object.keys(emailList).sort(function(a, b) {a.timestamp - b.timestamp});
}

function signInSuccess() {
	retrieveAllEmails(function(emailList) {
		var categories = runCategoryFinder(emailList);
		console.log(categories)
		categories = categories.slice(0, 5);
		findCategoriesAndAddToEmails(emailList, categories);

		visualizeData(emailList, categories, CENTER_DIV_ID);

		var emailList = sortEmailsByTimestamp(emailList);
		//populateEmailList(emailList, RIGHT_SIDEBAR_DIV_ID);
	});
}

function signInFailure() {
	console.log(" :( ")
}