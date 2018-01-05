/**
	@author: Amol Kapoor
	@date: 5-24-16

	Description: Category Object, used to define the parameters of a category.
*/


/**
	@param: data; {}; generic field for generic inputs, as of yet undecided
*/
function Category(data) {		
	var categoryData = data.data;
	this.data = categoryData;
	this.id = categoryData;

	/**
		Takes in an email and checks if this category is relevant to that email.

		@param: email; Email; the email to check
		@return: true if the Email has a sender name that matches the category
	*/
	this.match = function(email) {
		for(var user in email.usersFrom) {
			if(user === categoryData)
				return true;
		}
	}
}
