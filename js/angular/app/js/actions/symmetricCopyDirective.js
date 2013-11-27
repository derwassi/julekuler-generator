
angular.module('kpg.directive.actions.symmetricCopy', [])
    .directive('kpgActionsSymmetricCopy', function () {
        var scope;

        var createSelector = function(element, symmetricAreas){
            var $select = angular.element('<select></select>');
            $select.append(angular.element('<option></option>').attr('value','').html('Copy areas:'));//TODO: multilanguage
            for(var i=0;i<symmetricAreas;i++){
                for( var j=0;j<symmetricAreas;j++){
                    if(i!==j){
                        $select.append(angular.element('<option></option>').attr('value',i+"-"+j).html('Copy from ' + (i+1) + ' to ' + (j+1)));//TODO: multilanguage

                    }

                }
                $select.append(angular.element('<option></option>').attr('value',i+"-all").html('Copy from ' + (i+1) + ' to other'));//TODO: multilanguage
            }
            angular.element(element).append($select);
            $select.on('change',function(){

                var val = $select.val().split('-');
                if(val.length!=2){
                    return;
                }
                if(val[1] == 'all'){
                    for(var i=0;i<symmetricAreas;i++){
                        if(i!=val[0]){
                            scope.copyOver(parseFloat(val[0]),i);
                        }
                    }
                }else{
                    scope.copyOver(parseFloat(val[0]),parseFloat(val[1]));
                }
                $select.val("");
            })

        };

        return{
            //TODO: fetch services from attributes
            link: function ($scope, element, attrs) {
                scope = $scope;
                createSelector(element, $scope.patternService.getNumberOfSymmetricAreas());
            }
        };
    });
