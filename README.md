# Instagram Statistic Web App
A web applications which shows daily Instagram user statistics for selected users.

## Details
### Front-End
Setup and initialisation is in `app/js/app.js`.

Logic is mostly in `app/js/layout/user.controller.js`.


### Back-End
Setup and initialisation is in `server.js`.

DB logic is in `server/db-tools.js`.

The API is in `server/instagram-api.js`.

The back-end logic which gets the data from Instagram and stores it to the database is in `server/request-loop.js`.

