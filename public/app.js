var app = angular.module('directoryApp', ['ui.router', 'ngMaterial', 'ngMdIcons']);

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
              }],
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
