var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', ['$scope', '$http', '$filter', '$log', '$location', function($scope, $http, $filter, $log, $location) {

    $scope.locationInput = '';
    $scope.locationResponse = '';
    $scope.locationList = {};
    $scope.locations = []
    $scope.locationList.locations = $scope.locations;
    $scope.loc = {};
    $location.url('/');

    $scope.getWeather = function() {
        $scope.locationInput = $filter('lowercase')($scope.locationInput);

        $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.locationInput + '&units=metric&appid=46a1409601ea84d005d756c1a93d3a75')
            .success(function(result) {

                $scope.locationInput = '';
                $scope.locationResponse = angular.fromJson(result);

                $scope.loc = {
                    country: $scope.locationResponse.sys.country,
                    desc: $scope.locationResponse.weather[0].description,
                    icon: $scope.locationResponse.weather[0].icon,
                    id: $scope.locationResponse.id,
                    name: $scope.locationResponse.name,
                    temp: $filter('number')($scope.locationResponse.main.temp, 0)
                }

                $scope.urlLocation = $location.url();

                if ($scope.locationList.locations.length < 3) {
                    if ($scope.locationList.locations.length === 0) {
                        $scope.locationList.locations.push($scope.loc);
                        $location.url($scope.urlLocation + $filter('lowercase')($scope.locationList.locations[$scope.locationList.locations.length - 1].id));
                    } else {
                        $scope.locationList.locations.push($scope.loc);
                        $location.url($scope.urlLocation + ',' + $filter('lowercase')($scope.locationList.locations[$scope.locationList.locations.length - 1].id));
                    }
                } else {
                    $scope.locationList.locations.shift();
                    $scope.locationList.locations.push($scope.loc);
                    $scope.urlLocationArray = $scope.urlLocation.split(',');
                    $scope.urlLocationArray.shift();
                    $location.url($scope.urlLocationArray.join(',') + ',' + $filter('lowercase')($scope.locationList.locations[$scope.locationList.locations.length - 1].id));
                }

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
