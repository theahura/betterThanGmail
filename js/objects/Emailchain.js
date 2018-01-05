/**
	@author: Amol Kapoor
	@date: 5-24-16

	Description: Email Thread Object. Used to deal with chains of multiple emails under the same subject.
*/

/**
	Description: Email Thread Object. 
	Used to deal with chains of multiple emails under the same subject with different users.

	@param: emails; {Email}; all of the emails that would go in the email thread
	@param: rootEmail; Email; the email that starts the chain
	@param: id; string; the id assigned by the API for the chain, if given
*/
function Emailchain(emails, rootEmail, id) {
	this.root = rootEmail;
	this.emails = emails;
	this.id = id;

	this.subjects = {};
	this.userGroups = {};

	this.leafEmails = [];

	for(email in emails) {
		if(!this.subjects[email.subject])
			this.subjects[email.subject] = true;

		var userstring = email.users.join('-');

		if(!this.userGroups[userstring])
			this.userGroups[userstring] = true;

		if(this.timestamp < email.timestamp)
			this.timestamp = email.timestamp;

		if(!email.nextEmails)
			this.leafEmails.push(email);
	}
}