/**
 * Get Message with given ID.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} messageId ID of Message to get.
 * @param  {Function} callback Function to call when the request is complete.
//  */
function displayInbox() {
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'INBOX'
  });

  request.execute(function(response) {
    $.each(response.messages, function() {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id,
        'format': 'full',
        // 'metadataHeaders': ['From','Date','Subject']
      });

      messageRequest.execute(inboxPopulate);

  //     messageCategorizerHelper(messageRequest, inboxPopulate, function() {
		// messageCategorizer();
  //     })
    });
  });
}

function messageCategorizerHelper(request, callback1, callback2) {	
	request.execute(callback1);
	callback2();
}


// pulls Google user data if button is used to sign in
function onSignIn(googleUser) {
	console.log(googleUser);
	// Useful data for your client-side scripts:
	var profile = googleUser.getBasicProfile();
	console.log('Name: ' + profile.getName());
	console.log("Image URL: " + profile.getImageUrl());
	console.log("Email: " + profile.getEmail());

	// The ID token you need to pass to your backend:
	var id_token = googleUser.getAuthResponse().id_token;

	loadGmailApi();
	$('.title').hide();
	$('.footer').hide();
	$('.lower-wrapper').show();
	console.log(123);
	$('.googleUser-name').text(profile.getName());
	$('.googleUser-email-address').text(profile.getEmail());

};

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
	$('.lower-wrapper').hide();
	$('.top-bar').hide();
	$('.title').show();
}


function getHeader(headers, index) {
	var header = '';
	$.each(headers, function(){
		if(this.name === index){
			header = this.value;
			}
		});
	return header;
}

function getBody(message) {
	var encodedBody = '';
	if(typeof message.parts === 'undefined')
	{
		encodedBody = message.body.data;
	}
	else
	{
		encodedBody = getHTMLPart(message.parts);
	}
	encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
	return decodeURIComponent(escape(window.atob(encodedBody)));
}

function getHTMLPart(arr) {
	for(var x = 0; x <= arr.length; x++)
	{
		if(typeof arr[x].parts === 'undefined')
		{
			if(arr[x].mimeType === 'text/html')
			{
				return arr[x].body.data;
			}
		}
		else
		{
			return getHTMLPart(arr[x].parts);
		}
	}
	return '';
}

// GMAIL API INITIALIZATION

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '57868766442-5k76rbntgpclhno7vtfm7cv3pi5fss6v.apps.googleusercontent.com';

var SCOPES = ['https://mail.google.com/'];

var API_KEY = 'AIzaSyBvPYccuxmhOA_T7RafT8ZnDphEIIBaXu8'

function handleClientLoad() {
	console.log(111);
  gapi.client.setApiKey(API_KEY);
  window.setTimeout(checkAuth, 1);
}

/**
* Check if current user has authorized this application.
*/
function checkAuth() {
	console.log(222);
	gapi.auth.authorize(
	  {
	    'client_id': CLIENT_ID,
	    'scope': SCOPES.join(' '),
	    'immediate': false
	  }, handleAuthResult);
}

/**
* Handle response from authorization server.
*
* @param {Object} authResult Authorization result.
*/
function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		// Hide auth UI, then load client library.
		
		// pulls Google user data if button is NOT used to sign in
		$.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + authResult.access_token, function(data) {
			$('.googleUser-name').text(data.name);
			$('.googleUser-email-address').text(data.email);
		
			loadGmailApi();
			$('.lower-wrapper').show();
		});

	} else {
	  // Show auth UI, allowing the user to initiate authorization by
	  // clicking authorize button.
		$('.title').show();
		$('.footer').show();
	}
}

/**
* Initiate auth flow in response to user clicking authorize button.
*
* @param {Event} event Button click event.
*/
function handleAuthClick(event) {
	gapi.auth.authorize(
	  {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
	  handleAuthResult);
	return false;
}

/**
* Load Gmail API client library. List labels once client library
* is loaded.
*/
function loadGmailApi() {
	gapi.client.load('gmail', 'v1', displayInbox);
}
