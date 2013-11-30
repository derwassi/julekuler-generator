'use strict';

/* Controllers */

angular.module('kpg.controller.persist.persist', []).
    controller('kpgPersist', ['$scope',
        '$location',
        'titleCodecService',
        'patternCodecService',
        'colorCodecService',
        'modelService',
        'bookmarkService',
        'traversePatternFactory',
        'imageService'
        , function ($scope, $location, titleCodecService, patternCodecService, colorCodecService, modelService, bookmarkService, traversePatternFactory,imageService) {
            var patternService = traversePatternFactory({});
            console.log(titleCodecService);
            var allProperties = {'title': titleCodecService, 'pattern': patternCodecService, 'color': colorCodecService};
            //TODO: get urls and add replacement

            var socialStuff = {'twitter': '',
                'gplus': '',
                'facebook': ''};

            //store data in url
            var saveToUrl = function () {
                angular.forEach(allProperties, function (codec, k) {

                    console.log(codec, k);
                    $location.search(k, codec.encode(patternService.traversePattern, modelService));
                });
            };


            $scope.model = modelService;

            /**
             * loads from URL
             */
            $scope.loadStateFromUrl = function () {
                var savedState = $location.search();
                angular.forEach(allProperties, function (codec, k) {
                    if (typeof savedState[k] !== 'undefined') {

                        codec.decode(savedState[k], patternService.traversePattern, modelService);

                    }
                });
            };

            $scope.loadStateFromUrl();
            /**
             * saves state to url
             */
            $scope.saveStateToUrl = function () {
                saveToUrl();
            };

            $scope.saveStateToImage=function(){
                imageService.download(modelService,patternService,{});
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

