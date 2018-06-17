# CalorieMeasurePlatform

This is a Meteor application bundle. It has only one external dependency:
Node.js v4.8.4. To run the application:

  $ (cd programs/server && npm install)
  $ export MONGO_URL='mongodb://user:password@host:port/databasename'
  $ export ROOT_URL='http://example.com'
  $ export PORT=3000
  $ node main.js

Use the PORT environment variable to set the port where the
application will listen. The default is 80, but that will require
root on most systems.

Find out more about Meteor at meteor.com.
