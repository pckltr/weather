var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', ['$scope', '$http', '$filter', '$log', '$location', function($scope, $http, $filter, $log, $location) {

    $scope.locationInput = '';
    $scope.locationList = {};
    var idsInUrl = false;
    var loc = {};
    var locationResponse = '';
    var locations = [];
    var cardLimit = 3;
    var appId = "46a1409601ea84d005d756c1a93d3a75";

    $scope.locationList.locations = locations;

    var getIdsFromUrl = function() {

        var urlLocationArray = [];
        var urlLocationWithoutSlash = $location.url().slice(1, $location.url().length);

        if (urlLocationWithoutSlash.length !== 0) {
            urlLocationArray = urlLocationWithoutSlash.split(',');
        } else {
            urlLocationArray = [];
        }

        return urlLocationArray;
    }

    var addCards = function(response) {

        var locationList = $scope.locationList.locations;
        var locationListLength = locationList.length;

        loc = {
            country: response.sys.country,
            desc: response.weather[0].description,
            icon: response.weather[0].icon,
            id: response.id,
            name: response.name,
            temp: $filter('number')(response.main.temp, 0)
        }

        if (locationListLength < 3) {
            if (locationListLength === 0) {
                locationList.push(loc);
            } else {
                locationList.push(loc);
            }
        } else {
            locationList.shift();
            locationList.push(loc);
        }


    }

    var addIdsInUrl = function() {

        var locationList = $scope.locationList.locations;
        var locationListLength = locationList.length;
        var locationUrlArray = getIdsFromUrl();
        var locationUrlArrayLength = locationUrlArray.length;
        var urlLocation = $location.url();

        if (locationUrlArrayLength < cardLimit) {
            if (locationUrlArrayLength === 0) {
                $location.url(urlLocation + $filter('lowercase')(locationList[locationListLength - 1].id));
            } else {
                $location.url(urlLocation + ',' + $filter('lowercase')(locationList[locationListLength - 1].id));
            }
        } else {
            locationUrlArray.shift();
            $location.url(locationUrlArray.join(',') + ',' + $filter('lowercase')(locationList[locationListLength - 1].id));
        }

    }

    $scope.removeCard = function(cardId) {

        var locationList = $scope.locationList.locations;
        var locationUrlArray = getIdsFromUrl();

        for (var i = 0; i < locationList.length; i++) {

            if (locationList[i].id === cardId) {

                locationList.splice(i, 1);
                locationUrlArray.splice(i, 1);

                $scope.locationList.locations = locationList;
                $location.url(locationUrlArray.join(','));

            }

        }

    }

    $scope.getWeather = function(inputText) {

        var inputVar = $filter('lowercase')(inputText);

        if (inputVar !== undefined || inputVar !== '' || inputVar !== null) {

            $http.get('http://api.openweathermap.org/data/2.5/weather?' + (isNaN(inputVar) ? 'q=' + inputVar : 'id=' + inputVar) + '&units=metric&appid=' + appId)
                .then(function(response) {

                    $scope.locationInput = '';
                    locationResponse = angular.fromJson(response.data);
                    addCards(locationResponse);

                    if (!idsInUrl) {
                        addIdsInUrl();
                    }

                }, function(response) {

                    $log.log(response.data, "Max 60 calls per minute, max 50000 calls per day.");

                });

        }

    }

    var addCardsFromUrl = function(array) {

        if (array.length !== 0) {

            idsInUrl = true;

            for (var i = 0; i < cardLimit; i++) {
                $scope.getWeather(array[i]);
            }

            idsInUrl = false;
        }
    }

    angular.element(document).ready(function() {
        addCardsFromUrl(getIdsFromUrl());
    });


}]);

weatherApp.directive("weatherCard", function() {
    return {
        restrict: 'E',
        templateUrl: '../directives/weatherCard.html',
        replace: true,
        scope: {
            locationObject: "=",
            removeFunction: "&"
        }
    }
});
