// Creates a "routing REST service" to get the EMP data.
// This module provides a REST service that delivers an enriched list of
// employees from the EMP table in the Db2 database. It gets to the Db2
// data by calling a Db2 REST service that needs to be registered via:
//
// http://<byDb2Host>:<port>/services/DB2ServiceManager
//
// passing in following JSON document:
// {
//   "requestType": "createService",
//   "serviceName": "birthDayList",
//   "sqlStmt":     "select FIRSTNME as \"firstName\", LASTNAME as \"lastName\", BIRTHDATE as \"bDay\" from emp",
//   "description": "Returns the EMP data from sample database"
// }
//
// 2017/09/09 Oliver Draese, odraese@us.ibm.com
let http = require('http');

function EmpDataHandler() {
  // constructor code
}

// Local helper to modify the employee data.
// - The Name is changed to have only the first character uppercase
// - a new property is calculated and added as "age"
//
// Parm: emps The array of employees as received from Db2
function enhanceEmployees( emps ) {
  const MSPERYEAR = (1000 * 60 * 60 * 24 * 365.25);
  let   now       = Date.now();

  emps.forEach( emp => {
    emp.firstName = emp.firstName.charAt(0) + emp.firstName.substring( 1 ).toLowerCase();

    emp.lastName = emp.lastName.charAt(0) + emp.lastName.substring( 1 ).toLowerCase();

    let splitDate = emp.bDay.split( '-' );
    let bDate     = new Date( splitDate[0], splitDate[1], splitDate[2]);
    emp.age       = Math.floor((now - bDate.getTime()) / MSPERYEAR);
  });
}

// REST service handler, invoked whenever "getEmpData" is called on our URL
// Calls the Db2 REST service "birthDayList" to get the names and birthdates
// from the EMP table. Each of these entries is then enriched before being
// sent as request result to the invoker of this REST service. So, this
// function is a router/relay between the Angular application and the Db2
// REST service.
//
// Parms: appRequest   The Angular application HTTP/GET REST request
//        appResponse  Used to send the response to the Angular app
EmpDataHandler.prototype.getEmpData = function( appRequest, appResponse ) {
  // this REST (re-router) supports GET requests only
  if ( appRequest.method === 'GET' ) {
    // options for REST request to Db2
    const db2RequestOptions = {
      host:   '<putYourHostNameHere>',
      path:   '/services/birthDayList',
      port:   '446',
      method: 'POST',
      headers: { 'Authorization' : 'Basic <mySecurityToken>',
                 'Content-Type'  : 'application/json',
                 'Accept'        : 'application/json'            }
    };

    // callback function for asynchronous HTTP request
    let db2ReqCallback = function(db2Response) {
      let respData = '';  // complete response string

      // get a chunk of the resonse data
      db2Response.on( 'data', function (chunk) {
        respData += chunk;
      });

      // we got all the data. parse and resend it
      db2Response.on( 'end', function () {
        let json = JSON.parse( respData );

        // did Db2 report an "all OK"
        if ( json['StatusCode'] == 200 ) {
          let db2Data = json['ResultSet Output'];

          enhanceEmployees( db2Data );
          appResponse.send( db2Data );
        }
      });
    }

    // make the async REST call to Db2
    http.request(db2RequestOptions, db2ReqCallback).end();
  }
  else {
    appResponse.status(500).send( "Invalid request" );
  }
}

module.exports = new EmpDataHandler();
