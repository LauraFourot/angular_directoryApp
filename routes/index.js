var express 	= require('express');
var mongoose 	= require('mongoose');
var router 		= express.Router();
var Contact 	= mongoose.model('Contact');

// Index
router.get('/', function (req, res) {
	res.render('index');
});

// Get all the contacts
router.get('/contacts', function (req, res, next) {
	Contact.find(function(err, contacts){
		if(err){ return next(err); }
		res.json(contacts);
	});
});

// Add a contact
router.post('/contacts', function (req, res, next) {
	var contact = new Contact(req.body);
	contact.save(function(err, contact) {
		if(err){ return next(err); }
		res.json(contact);
	});
});

// The contact param
router.param('contact', function(req, res, next, id){
		var query = Contact.findById(id);
		query.exec(function(err,contact){
			if (err) { return next(err); }
    	if (!contact) { return next(new Error('can\'t find contact')); }
    	req.contact = contact;
    	return next();
		});
});

// Get all a single contact
router.get('/contacts/:contact', function (req, res, next) {
	res.json(req.contact);
});

// Update a contact
router.put('/contacts/:contact', function (req, res, next){
	Contact.findOneAndUpdate(
		{ _id: req.params.contact },
		{ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email },
		function(err, contact) {
  		if (err) throw err;
		});
});

// Delete a contact
router.delete('/contacts/:contact', function (req, res, next) {
	var contact = req.contact;
	contact.remove(function(err) {
    if (err) {
    	return res.status(400).send({message: getErrorMessage(err)});
    } else {
    	res.json(contact);
    }
  });
});

module.exports = router;
