var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', ['$scope', '$http', '$filter', '$log', '$location', function($scope, $http, $filter, $log, $location) {

    $scope.idsInUrl = false;
    $scope.loc = {};
    $scope.locationInput = '';
    $scope.locationList = {};
    $scope.locationResponse = '';
    $scope.locations = [];
    $scope.urlLocationArray = [];

    $scope.urlLocationWithoutSlash = $location.url().slice(1, $location.url().length);

    $scope.locationList.locations = $scope.locations;

    if ($scope.urlLocationWithoutSlash.length !== 0) {
        $scope.urlLocationArray = $scope.urlLocationWithoutSlash.split(',');
        $location.url('/');
    } else {
        $scope.urlLocationArray = [];
        $location.url('/');
    }

    $scope.addCards = function(response) {

        $scope.locationLength = $scope.locationList.locations.length;

        $scope.loc = {
            country: response.sys.country,
            desc: response.weather[0].description,
            icon: response.weather[0].icon,
            id: response.id,
            name: response.name,
            temp: $filter('number')(response.main.temp, 0)
        }

        if ($scope.locationLength < 3) {
            if ($scope.locationLength === 0) {
                $scope.locationList.locations.push($scope.loc);
            } else {
                $scope.locationList.locations.push($scope.loc);
            }
        } else {
            $scope.locationList.locations.shift();
            $scope.locationList.locations.push($scope.loc);
        }
    }

    $scope.addIdsInUrl = function() {

        $scope.urlLocation = $location.url();

        $scope.urlLocationWithoutSlash = $location.url().slice(1, $location.url().length);

        if ($scope.urlLocationWithoutSlash.length !== 0) {
            $scope.urlLocationArray = $scope.urlLocationWithoutSlash.split(',');
            $location.url('/');
        } else {
            $scope.urlLocationArray = [];
            $location.url('/');
        }

        $scope.urlLocationArrayLength = $scope.urlLocationArray.length;

        if ($scope.urlLocationArrayLength < 3) {
            if ($scope.urlLocationArrayLength === 0) {
                $location.url($scope.urlLocation + $filter('lowercase')($scope.locationList.locations[$scope.locationList.locations.length - 1].id));
            } else {
                $location.url($scope.urlLocation + ',' + $filter('lowercase')($scope.locationList.locations[$scope.locationList.locations.length - 1].id));
            }
        } else {
            $scope.urlLocationArray.shift();
            $location.url($scope.urlLocationArray.join(',') + ',' + $filter('lowercase')($scope.locationList.locations[$scope.locationList.locations.length - 1].id));
        }

    }

    $scope.getWeather = function(inputText) {

        $scope.inputVar = $filter('lowercase')(inputText);

        $http.get('http://api.openweathermap.org/data/2.5/weather?' + (isNaN($scope.inputVar) ? 'q=' + $scope.inputVar : 'id=' + $scope.inputVar) + '&units=metric&appid=46a1409601ea84d005d756c1a93d3a75')
            .then(function(response) {

                $scope.locationInput = '';
                $scope.locationResponse = angular.fromJson(response.data);
                $scope.addCards($scope.locationResponse);

                if (!$scope.idsInUrl) {
                    $scope.addIdsInUrl();
                }

            }, function(response) {

                $log.log(response.data, "Max 60 calls per minute, max 50000 calls per day.");

            });

    }

    $scope.addCardsFromUrl = function(array) {

        if (array.length !== 0) {

            $scope.idsInUrl = true;

            for (var i = 0; i < 3; i++) {
                $scope.getWeather(array[i]);
            }

            $scope.idsInUrl = false;
        }
    }

    angular.element(document).ready($scope.addCardsFromUrl($scope.urlLocationArray));


}]);

weatherApp.directive("weatherCard", function() {
    return {
        restrict: 'AECM',
        templateUrl: '../directives/weatherCard.html',
        replace: true,
        scope: {
            locationObject: "="
        }
    }
});
