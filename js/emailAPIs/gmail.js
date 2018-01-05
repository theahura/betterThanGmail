/**
	@author: Ganesh Ravichandran
	@date: 5-25-16, updated: 5-30-16 by Amol Kapoor

	Description: Google API loading and data handling functions
*/

var clientId = '57868766442-5k76rbntgpclhno7vtfm7cv3pi5fss6v.apps.googleusercontent.com';
var apiKey = 'AIzaSyBvPYccuxmhOA_T7RafT8ZnDphEIIBaXu8'
var scopes = ['https://mail.google.com/'];

/**
	These functions are responsible for loading gmail library and authorizing.
	SignIn calls the auth chain. Calls signInSuccess or signInFailure depending on the result.
*/
function signIn() {
	gapi.client.setApiKey(apiKey);
	window.setTimeout(signInAuto,1);
}

function signInAuto() {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function signInManual(event) {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
}

function handleAuthResult(authResult) {	
	if(!authResult || !authResult.access_token) {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
		return;
	} 

	if (authResult && !authResult.error) {
		gapi.client.load('gmail', 'v1', signInSuccess);
	} else {
		signInFailure();
	}
}

//============================================================================================================================
//Retrieve
//============================================================================================================================

/**
	Get all messages.

	@param: callback; function; takes in an array of Email objects as a param
*/
function retrieveAllEmails(callback) {
	var request = gapi.client.gmail.users.messages.list({
		'userId': 'me',
		'labelIds': 'INBOX'
	});

	request.execute(function(response) {

		var promiseArray = [];

		$.each(response.messages, function() {
			
			var emailId = this.id;

			var promise = new Promise(function(resolve, reject) {
				retrieveSingleEmail('me', emailId, function(email) {
					resolve(email);
				});
			});
			promiseArray.push(promise);
		});
		
		Promise.all(promiseArray).then(callback);
	});
}

/**
 * Get Message with given ID.
 *
 * @param: userId; String; User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param: messageId; String; ID of Message to get.
 * @param: callback; function; Function to call when the request is complete. Takes an email object
 	as a param
 */
function retrieveSingleEmail(userId, messageId, callback) {
	_retrieveSingleEmail(userId, messageId, function(gmailEmailObj) {
		console.log(gmailEmailObj)

		var emailId = gmailEmailObj.id;
		var timestamp = gmailEmailObj.internalDate;
		var parentId = gmailEmailObj.threadId;
		var data = getHTMLBody(gmailEmailObj.payload);

		var usersTo = {};
		var usersFrom = {};
		var subject = "Empty Subject";

		for(var i in gmailEmailObj.payload.headers) {
			var headerObj = gmailEmailObj.payload.headers[i];
			if(headerObj.name === 'To') {
				var contactArray = headerObj.value.split(',');
				for(var j in contactArray) {
					var contact = contactArray[j];
					usersTo[contact] = true;
				}
			} else if(headerObj.name === 'From') {
				var contactArray = headerObj.value.split(',');
				for(var j in contactArray) {
					var contact = contactArray[j];
					usersFrom[contact] = true;
				}
			} else if (headerObj.name === 'Subject') {
				subject = headerObj.value ? headerObj.value : subject;
			}
		}
	
		var attachments = [];
		for(part in gmailEmailObj.payload.parts) {
			if(part.filename && part.filename.length > 0) {
				attachments.push(part.body.attachmentId);
			}
		}

		var unread = false;
		for(i in gmailEmailObj.labelIds) {
			var label = gmailEmailObj.labelIds[i];
			if(label === "UNREAD") {
				unread = true;
				break;
			}
		}

		var email = new Email(timestamp, subject, usersTo, usersFrom, unread, data, emailId, attachments, parentId);
		callback(email);
	});
}

function _retrieveSingleEmail(userId, messageId, callback) {
 	var request = gapi.client.gmail.users.messages.get({
 		'userId': userId,
 		'id': messageId,
 		'format': 'full'
 	});

 	request.execute(callback);
}

function getHTMLBody(payload) {
	var encodedBody = '';
	if(!payload.parts) {
		encodedBody = payload.body.data;
	}
	else {
		encodedBody = getHTMLPart(payload.parts);
	}
	encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
	return decodeURIComponent(escape(window.atob(encodedBody)));
}

function getHTMLPart(arr) {
	for(var x = 0; x < arr.length; x++) {
		if(!arr[x].parts) {
			if(arr[x].mimeType === 'text/html') {
				return arr[x].body.data;
			}
		} else {
			return getHTMLPart(arr[x].parts);
		}
	}
	return '';
}

//============================================================================================================================
//Send
//============================================================================================================================

/**
 * Send Message.
 *
 * @param: userId; String; User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param: email; String; RFC 5322 formatted String.
 * @param: threadId; String; the id for which chain this email goes in
 * @param: callback; function; Function to call when the request is complete.
 */
function sendEmail(userId, email, threadId, callback) {
  var base64EncodedEmail = btoa(email);
  var request = gapi.client.gmail.users.messages.send({
    'userId': userId,
    'threadId': threadId,
    'message': {
      'raw': base64EncodedEmail
    }
  });
  request.execute(callback);
}

//============================================================================================================================
//Delete
//============================================================================================================================

/**
 * @param: userId; String; User's email address. The special value 'me'
 * @param: messageId; String; ID of Message to get.
 */
function trashEmail(userId, messageId) {
	$.ajax({
	  type: "POST",
	  url: "https://www.googleapis.com/gmail/v1/users/" + userId + "/messages/"+ messageId + "/trash",
	  success: function(data, textStatus, jqXHR) { console.log(textStatus) }
	});
}

function untrashEmail(userId, messageId) {
	$.ajax({
	  type: "POST",
	  url: "https://www.googleapis.com/gmail/v1/users/" + userId + "/messages/"+ messageId + "/untrash",
	  success: function(data, textStatus, jqXHR) { console.log(textStatus) }
	});
}


//============================================================================================================================
//Update Read Status
//============================================================================================================================

/**
 * Modify the Labels a Thread is associated with.
 *
 * @param: userId; String; User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param: threadId; String; ID of Thread to modify.
 * @param: callback; function; Function to call when the request is complete.
 */
function markRead(userId, threadId, callback) {
  	var request = gapi.client.gmail.users.threads.modify({
	    'userId': userId,
	    'id': threadId,
	    'removeLabelIds': ['UNREAD']
	});
	request.execute(callback);
}

function markUnread(userId, threadId, callback) {
	var request = gapi.client.gmail.users.threads.modify({
	    'userId': userId,
	    'id': threadId,
	    'addLabelIds': ['UNREAD']
	});
	request.execute(callback);
}