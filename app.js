var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');
var fetch = require('node-fetch');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pokemonsRouter = require('./routes/pokemons');

var app = express();

var CONFIG = require('./config/config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(async function(req, res, next) {
  res.locals.connection = await mysql.createConnection({
    host: CONFIG.db_host,
    user: CONFIG.db_user,
    password: CONFIG.db_password,
    database: CONFIG.db_name
  });

  //res.locals.connection.connect();
  next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/pokemons', pokemonsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// spawn pokemons
setInterval(
  async function() {
    try {
      const connection = await mysql.createConnection({
        host: CONFIG.db_host,
        user: CONFIG.db_user,
        password: CONFIG.db_password,
        database: CONFIG.db_name
      });
      
      var number = Math.floor(Math.random() * 152) - 1;
      var response = await fetch('https://pokeapi.co/api/v2/pokemon/' + number, {
          method: 'GET'
      });
      var pokemonData = await response.json();
      
      var rows, fields;

      [rows, fields] = await connection.execute("INSERT INTO pokemons (number, name, image, assigned) VALUES (" + number + ", '" + pokemonData.name + "', '" + pokemonData.sprites.front_default + "', false);");
      [rows, fields] = await connection.execute("SELECT LAST_INSERT_ID();");
      var pokemon = rows[0]['LAST_INSERT_ID()'];
  
      setTimeout(async function() {
        // remove pokemon
        [rows, fields] = await connection.execute("DELETE FROM pokemons WHERE id=" + pokemon + " AND assigned=false");
        //console.log(rows);
      }, 1000 * CONFIG.life_time);
    } catch (err) {
      console.log(err);
      res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
  },
  1000 * CONFIG.spawn_circle
);

module.exports = app;
