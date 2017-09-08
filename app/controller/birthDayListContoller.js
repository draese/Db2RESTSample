// Controller for birthday list.
// This controller is linked to the table, which shows the birthdays. It is
// loading the raw data from Db2 through Db2's REST interface and keeps it
// available as the "empData" array in the controller's scope. It also
// provides a function "aveAge" to deliver the rounded average age of all
// employees in the table.
//
// 2017/09/09 Oliver Draese, odraese@us.ibm.com
angular.module("birthDayList")
  .controller("birthDayListController", ($scope,$http) => {

  // REST Request, getting the EMP table content from Node Server
  $http.get( 'http://localhost:3000/getEmpData' ).then( (res) => {
    // make data available for table
    $scope.empData = res.data;
  }).
  catch( (err) => {
    // error while fetching data from Db2
    $scope.empData = [];
    console.error( 'Failed to load EMP data from server' );
  });

  // Function to deliver the rounded average age
  $scope.avgAge = function() {
    let total = 0;

    $scope.empData.forEach( emp => {
      total += emp.age;
    });

    return Math.floor((total / $scope.empData.length) + 0.5);
  }

});
