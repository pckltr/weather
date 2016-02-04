var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', ['$scope', '$http', '$filter', '$log', function($scope, $http, $filter, $log) {

    $scope.locationInput = '';
    $scope.locationResponse = '';
    $scope.locationList = {};
    $scope.locations = []
    $scope.locationList.locations = $scope.locations;
    $scope.loc = {};

    $scope.getWeather = function() {
        $scope.locationInput = $filter('lowercase')($scope.locationInput);

        $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.locationInput + '&units=metric&appid=46a1409601ea84d005d756c1a93d3a75')
            .success(function(result) {

                $scope.locationInput = '';
                $scope.locationResponse = angular.fromJson(result);

                $scope.loc = {
                    country: $scope.locationResponse.sys.country,
                    icon: $scope.locationResponse.weather[0].icon,
                    desc: $scope.locationResponse.weather[0].description,
                    name: $scope.locationResponse.name,
                    temp: $filter('number')($scope.locationResponse.main.temp, 0)
                }

                $scope.locationList.locations.push($scope.loc);

            })
            .error(function(data, status) {

                $log.log(data, status, "Max 60 calls per minute, max 50000 calls per day.");
            });
    }

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
