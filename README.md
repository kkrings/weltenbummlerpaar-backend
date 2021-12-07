# Weltenbummlerpaar Backend

This project contains the [Nest][]-based back end of the *Weltenbummlerpaar*
travel diary web application. It provides a *RESTful API* for e.g. reading and
storing diary entries from or to a [MongoDB][] database, respectively.

[Nest]: https://nestjs.com/
[MongoDB]: https://www.mongodb.com/

The corresponding [Angular][]-based front-end application can be found
[here][Frontend].

[Angular]: https://angular.io/
[Frontend]: https://kkrings.github.io/weltenbummlerpaar/


## Configuration

This application is configured via environment variables. The following
variables are required:

    WELTENBUMMLERPAAR_BACKEND_APP_PORT='3000'
    WELTENBUMMLERPAAR_BACKEND_DATABASE_URI='some MongoDB URI'
    WELTENBUMMLERPAAR_BACKEND_DATABASE_AUTO_INDEX='true'
    WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION='path to image uploads'
    WELTENBUMMLERPAAR_BACKEND_JWT_SECRET='some JWT secret'
    WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS='[]'

The following variables are optional:

    WELTENBUMMLERPAAR_BACKEND_APP_PREFIX='api'
    WELTENBUMMLERPAAR_BACKEND_HTTPS_CERT='path to public SSL key'
    WELTENBUMMLERPAAR_BACKEND_HTTPS_KEY='path to private SSL key'
    WELTENBUMMLERPAAR_BACKEND_STATIC_FILES_ROOT_PATH='path to static files'

It is recommended to set these variables in a `.env` file. Note that in
production, *MongoDB* indices should be set manually instead of using
the auto index option. 


## Installation

After configuring the application, its dependencies need to be installed:

    npm install

The next step is to build the application:

    npm run build

The application requires to once inject an administration user into the
*MongoDB* database:

    npm run register:admin -- \
      --username 'some user name' \
      --password 'some password'

The HTTP(s) server can either be started (in production mode):

    npm run start:prod
