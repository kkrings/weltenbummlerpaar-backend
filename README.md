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


## Deployment

This section shows how to deploy the back-end application on a server running
[Ubuntu][] 20.04 via [NGINX][]. It is not shown how to generally install and
configure the required *NGINX* server and *MongoDB* database.

[Ubuntu]: https://ubuntu.com/
[NGINX]: https://www.nginx.com/

The first step is to download the back-end application's latest
[release][Releases] and to extract it:

    tar -xzvf weltenbummlerpaar-backend-vx.x.x.tar.gz
    mkdir -p www/weltenbummlerpaar/static
    mv weltenbummlerpaar-backend-vx.x.x www/weltenbummlerpaar/api
    rm weltenbummlerpaar-backend-vx.x.x.tar.gz
    cd www/weltenbummlerpaar/api

[Releases]:https://github.com/kkrings/weltenbummlerpaar-backend/releases

In this example, the `static` sub folder would contain the front-end
application.

The second step is to configure the application by setting environment
variables in a `.env` file:

    WELTENBUMMLERPAAR_BACKEND_APP_PORT='3000'
    WELTENBUMMLERPAAR_BACKEND_APP_PREFIX='api'
    WELTENBUMMLERPAAR_BACKEND_DATABASE_URI='some MongoDB URI'
    WELTENBUMMLERPAAR_BACKEND_DATABASE_AUTO_INDEX='false'
    WELTENBUMMLERPAAR_BACKEND_IMAGE_UPLOAD_DESTINATION='some path'
    WELTENBUMMLERPAAR_BACKEND_JWT_SECRET='some secret'
    WELTENBUMMLERPAAR_BACKEND_CORS_ORIGINS='[]'

The third step is to install the application's dependencies:

    npm install

The fourth step is to build the application:

    npm run build

The fifth step is to inject an administration user into the *MongoDB* database:

    npm run register:admin -- \
      --username 'some user name' \
      --password 'some password'

The sixth step is to start the application via the [PM2][] process manager. It
allows to configure all of the application's required environment variables in
its *ecosystem* file `app.config.js`:

    module.exports = {
      apps : [{
        name: 'weltenbummlerpaar-backend',
        script: 'npm run start:prod',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
        },
      }],
    };

[PM2]: https://pm2.keymetrics.io/

The *MongoDB URI* usually contains both the user name and password of the
*MongoDB* user that is allowed to read and write from and to the dedicated
database containing the diary entries, respectively. This user should not be
mistaken with the application's administration user, which was created in the
fifth step.

You also have to make sure that the user that is running the application, which
should not be *root*, is allowed to read both the public *SSL* cert and the
private *SSL* key.

After its configuration, the application can be started:

    pm2 start app.config.js

The last step is to change the configuration of the *NGINX* server in way that
requests to the `api` endpoint are redirected to the port the application is
listening on:

    server {
      ...

      location /api/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass https://localhost:3000;
      }

      ...
    }
