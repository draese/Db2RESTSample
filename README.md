# Db2RESTSample
Sample Node.JS/Angular project, receiving data from Db2 for z/OS

This is a simple sample application, using Node.JS with Express as server
and Angular as client framework. The server side is implementing a REST
service "getEmpData" which is used by the Angular application to receive
the data that is displayed in a table. 

This REST service in turn uses Db2 for z/OS REST services to get the
actual data from the sample database's EMP tample. The whole REST
routing mechanism is found in the EmpDataHandler.js file, which also
describes how to register the SQL as REST service on Db2 side.

For additional information, see:
https://www.ibm.com/support/knowledgecenter/en/SSEPEK_11.0.0/restserv/src/tpc/db2z_restservices.html
