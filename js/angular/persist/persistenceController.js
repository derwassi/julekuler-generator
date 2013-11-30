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
            //console.log(titleCodecService);
            var allProperties = {'title': titleCodecService, 'pattern': patternCodecService, 'color': colorCodecService};
            $scope.socialMedia = {url:'',title:'Julekuler Generator'};

            //store data in url
            var saveToUrl = function () {
                angular.forEach(allProperties, function (codec, k) {

                    //  console.log(codec, k);
                    $location.search(k, encodeURIComponent(codec.encode(patternService.traversePattern, modelService)));
                });
                document.title = modelService.title + ' - Julekuler generator';
            };


            $scope.model = modelService;

            /**
             * loads from URL
             */
            $scope.loadStateFromUrl = function () {
                var savedState = $location.search();
                angular.forEach(allProperties, function (codec, k) {
                    if (typeof savedState[k] !== 'undefined') {

                        codec.decode(decodeURIComponent(savedState[k]), patternService.traversePattern, modelService);

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
                $scope.socialMedia.url = encodeURIComponent(window.location);
                $scope.socialMedia.title = encodeURIComponent(document.title);
                $scope.url = 'test';
                $scope.title = 'noch ein test';
                if (mode == 'local') {
                    bookmarkService.bookmark();
                    return false;
                }
            };

        }]);

