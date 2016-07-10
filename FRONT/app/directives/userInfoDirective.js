var module = angular.module("myApp");

module.directive('userInfo', function() {
    var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */
    directive.templateUrl = "./app/views/user-info.html";

    return directive;
});