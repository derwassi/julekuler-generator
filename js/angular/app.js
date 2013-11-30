'use strict';


// Declare app level module which depends on filters, and services
angular.module('kpg', [
    'kpg.service.pattern.pattern',
    'kpg.service.model.model',
    'kpg.directive.canvas.colorpicker',
    'kpg.directive.canvas.html',
    'kpg.controller.canvas.html',
    'kpg.controller.actions.actions',
    'kpg.directive.actions.symmetricCopy',
    'kpg.directive.render.threeJs',
    'kpg.controller.render.threeJs',
    'kpg.service.persist.url',
    'kpg.controller.persist.persist',
    'kpg.service.persist.image'


]);
