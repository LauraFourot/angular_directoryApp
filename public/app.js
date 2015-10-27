var app = angular.module('directoryApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
    	$stateProvider
      .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl',
          resolve: {
            post: ['contacts', function (contacts) {
                return contacts.getAll();
              }]
          }
      })
			.state('contacts', {
          url: '/contacts/:id',
          templateUrl: '/edit.html',
          controller: 'EditCtrl',
					resolve: {
						post: ['$stateParams', 'contacts', function ($stateParams, contacts) {
								return contacts.get($stateParams.id);
							}]
					}
      });
		$urlRouterProvider.otherwise('home');
	}
]);

app.controller('MainCtrl', [ '$scope', '$stateParams', 'contacts',  function($scope, $stateParams, contacts){

	$scope.contacts = contacts.contacts;

	$scope.addContact = function(){
		 if(!$scope.firstName || $scope.firstName === '' || !$scope.lastName || $scope.lastName === '' )
		 { return; }
		contacts.create({
			firstname: $scope.firstName,
			lastname: $scope.lastName,
			email: $scope.email
		});
		$scope.firstName = "";
		$scope.lastName = "";
		$scope.email = "";
	};

	$scope.deleteContact = function(contact){
		contacts.delete(contact);
		$scope.contacts.splice($scope.contacts.indexOf(contact), 1);
	}

}]);

app.controller('EditCtrl', [ '$scope', '$stateParams', 'contacts',  function($scope, $stateParams, contacts){

	$scope.contact = contacts.contacts;

	$scope.editContact = function(){
		contacts.update($stateParams.id,
			{firstname: $scope.contact.firstname,
			lastname: $scope.contact.lastname,
			email: $scope.contact.email});
	};


}]);

app.factory('contacts', ['$http', function($http){

	var o = { contacts: [] };

	// Get all the contacts
	o.getAll = function() {
		return $http.get('/contacts')
			.success(function (data) {
				angular.copy(data, o.contacts)
			});
	};

	// Create a contact
	o.create = function(contact) {
		return $http.post('/contacts', contact)
			.success(function(data) {
				o.contacts.push(data);
			});
	};

	// Get a single contact
	o.get = function (id) {
		return $http.get('/contacts/' + id)
		.success(function(data) {
			angular.copy(data, o.contacts)
		});
	};

	// Update a contact
	o.update = function (id, contact) {
		return $http.put('/contacts/' + id, contact)
		.success(function(data) {
				angular.copy(data, o.contacts)
			});
	};

	// Delete a contact
	o.delete = function (contact){
	return $http.delete('/contacts/'+contact._id, null)
	.then(function (res) {
		return res.data;
	});
}
	return o;
}]);
