# movies-library
 Movies library project using Node.js, Express.js, Docker


# Startup
To run the app you'll need to create a .env file, all required fields are in .env example
After that you need just to run it with Docker using command like: 
`docker run --name movies -p  8000:8050 -e APP_PORT=8050 bu4enka/movies-api`

Or you can clone this repo, install required modules via `npm i` and run the app either via `npm start` or `npm run dev`

# About
This is a simple Node.js REST API with Express.js framework.
SQLite database is used to store the data and Sequlize is used to desribe entites and relations between them.

# Routes:

GET    api/v1/movies       - get all movies stored in db. You can additionaly use some query params: 
  - sort -- if true, it'll sort movies alphabeticaly. If fasle - nothing happens
  - title -- allows you to find a movie by it's title (or part of the title)
  - name -- allows you to find a movie where some actor stars

POST  api/v1/movies        - create a movie

GET   api/v1/movies/:id    - show specific movie 

DEL   api/v1/movies/:id    - delete movie with given `:id`

PATCH api/v1/movies/:id    - update movie with given `:id`

POST  api/v1/movies/import - import movies from `.txt` file

POST  api/v1/users         - create a user

POST  api/v1/sessions      - create a session (sign in)
