// Sample Angular application to receive and display data from Db2.
// This Angular application is showing the content of the EMP tamble of the
// Db2 sample database as a birthday list.
//
// 2017/09/09 Oliver Draese, odraese@us.ibm.com
angular.module( "birthDayList", ["ngRoute"] );

angular.module( "birthDayList" )
  .config( ($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true);

    // single routing point is showing the empList in the view
    $routeProvider.when("/list", {
        templateUrl: "/views/empList.html"
    });
});
