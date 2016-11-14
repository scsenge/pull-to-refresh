'use strict';
angular
	.module('app')
	.controller('HomeController', ['$scope', '$timeout', function ($scope, $timeout) {
		//Set page title and description
		//Setup view model object
		var vm = this;
		vm.refreshing = false;

		$scope.loadNewItems = function () {
			$scope.$apply();
			return $timeout(function () {
			}, 2000)
		};

		vm.tutorials = [
			{"task":"do the loundry","who":"Scott","dueDate":"2013-05-19","done":false},
			{"task":"go to the shop","who":"Elisabeth","dueDate":"2013-05-21","done":false},
			{"task":"check mails","who":"Trish","dueDate":"2013-05-30","done":false},
			{"task":"do the homework","who":"Josh","dueDate":"2013-05-15","done":true},
			{"task":"meet Ann","who":"Scott","dueDate":"2013-05-19","done":false},
			{"task":"coffee with Lily","who":"Elisabeth","dueDate":"2013-05-21","done":false},
			{"task":"cook the dinner","who":"Trish","dueDate":"2013-05-30","done":false},
			{"task":"go to the cinema","who":"Josh","dueDate":"2013-05-15","done":true},
			{"task":"do the washing up","who":"Scott","dueDate":"2013-05-19","done":false},
			{"task":"feed the fishes","who":"Elisabeth","dueDate":"2013-05-21","done":false}
		]
	}]);
