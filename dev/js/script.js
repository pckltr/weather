var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', ['$scope', '$http', '$filter', '$log', function ($scope, $http, $filter, $log) {

    $scope.locationInput = '';
    $scope.locationResponse = '';
    $scope.locationName = '';
    $scope.locationTemperature = '';
    $scope.locationDescription = '';

    $scope.getWeather = function() {
        $scope.locationInput = $filter('lowercase')($scope.locationInput);

        $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.locationInput + '&appid=46a1409601ea84d005d756c1a93d3a75')
            .success(function (result) {

                $scope.locationInput = '';
                $scope.locationResponse = angular.fromJson(result);
                $scope.locationName = $scope.locationResponse.name;
                $scope.locationTemperature = $scope.locationResponse.main.temp;
                $scope.locationDescription = $scope.locationResponse.weather[0].description;

            })
            .error(function (data, status) {

                $scope.locationResponse = data;

            });
    }

}]);