'use strict';

/* Controllers */

angular.module('kpg.controllers', []).
    controller('Persistence', ['$scope',
        '$location',
        'titleCodecService',
        'patternCodecService',
        'colorCodecService',
        'bookmarkService', function ($scope, $location, titleCodecService, patternCodecService, colorCodecService,bookmarkService) {

            var allProperties = {'title': titleCodecService, 'pattern': patternCodecService, 'color': colorCodecService};
            //TODO: get urls and add replacement

            var socialStuff = {'twitter': '', 'gplus': '', 'facebook': ''};

            //store data in url
            var saveToUrl = function () {
                allProperties.forEach(function (k) {
                    $location.search(k, codec.encode($scope.model[k]));
                });
            };



            /**
             * loads from URL
             */
            $scope.loadStateFromUrl = function () {
                var savedState = $location.search();
                allProperties.forEach(function (k, codec) {
                    if (typeof savedState[k] !== 'undefined') {
                        $scope.model[k] = codec.decode(savedState[k]);
                    } else {
                        $scope.model[k] = defaultValues[k];
                    }
                });
            };

            /**
             * saves state to url
             */
            $scope.saveStateToUrl = function () {
                saveToUrl();
            };

            /**
             * bookmark this page
             * @param mode defines where to bookmar (local, or social)
             */
            $scope.bookmark = function (mode) {
                saveToUrl();
                if (mode == 'local') {
                   bookmarkService.bookmark();
                } else {
                    if (typeof socialStuff[mode] !== 'undefined') {
                        var url = socialStuff[mode];
                        //TODO: Open stuff in new window
                    }
                }
            };

        }]);

