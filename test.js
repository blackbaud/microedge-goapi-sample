var request = require('request');
var yargs = require('yargs').argv;

// Get contact ID, user ID and private key from command line arguments
var contactId = yargs.i;
if(!contactId) {
	contactId = yargs.id;
}

var userId = yargs.u;
if(!userId) {
	userId = yargs.userId;
}

var privateKey = yargs.k;
if(!privateKey) {
	privateKey = yargs.privateKey;
}

// Abort if any of these weren't provided
if(!contactId) {
	console.log('Contact ID not provided.');
	return;
}
if(!userId) {
	console.log('User ID not provided.');
	return;
}
if(!privateKey) {
	console.log('Private key not provided.');
	return;
}

// Call me-auth to get an authorization JWT
request.post(
    'https://api.melabs.io/auth/token/me-auth',
    { json: { userId: userId, privateKey: privateKey } },
    function (error, response, body) {
        if (!error && response.statusCode == 200 && body.authenticated) {
            var token = body.token;
			var options = {
				url: 'https://api.melabs.io/goapi/contact/getContact',
				method: 'POST',
				headers: { 'Authorization' : 'bearer ' + token },
				json: true,
				body: { id: contactId }
			};
			
			// use the auth JWT to call the contact endpoint
			request(options, function(contactError, contactResponse, contactBody) {
					if (contactResponse.statusCode == 200) {
						var contact = contactResponse.body.contact;
						if(contact) {
							console.log('Name of contact: ' + contact.firstName + ' ' + contact.lastName);
						} else {
							console.log('Contact not found');
						}
					} else {
						console.log('There was an error retrieving the contact:');
						console.log(contactResponse);
					}
				});
        }
    }
);
