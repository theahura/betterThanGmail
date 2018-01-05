/**
	@author: Amol Kapoor
	@date: 5-24-16
*/


/**
	Single Email Object. Contains all of the relevant data for a single email. 
	Chains of these are stored in Emailchain objects.

	@param: timestamp; int; epoch time for when the email came in
	@param: subject; string; the subject for the email
	@param: usersTo; {}; the users who were sent this email
	@param: usersFrom; {}; the users who sent this email
	@param: unread; bool; whether this email is read
	@param: data; string; the data contained in the email
	@param: id; string; the id for the API being used
	@param: attachments; [String]; a list of ids for attachments
	@param: parentchain; Emailchain; the parent chain of emails 
	@param: previousEmail; Email; the previous email in the chain, or null if email is root of chain
	@param: nextEmails; {Email}; a list of all emails (including branches)
	@param: categories; [String]; a list of relevant categories this email is in
*/
function Email(timestamp, subject, usersTo, usersFrom, unread, data, id, attachments, chainId, previousEmail, nextEmails, categories) {
	this.chainId = chainId;
	this.subject = subject;
	this.usersTo = usersTo;
	this.usersFrom = usersFrom; 
	this.unread = unread;
	this.timestamp = timestamp; 
	this.attachments = attachments ? attachments : [];
	this.data = data;
	this.id = id;

	this.previousEmail = previousEmail;
	this.nextEmails = nextEmails;
	this.categories = categories ? categories : [];
}