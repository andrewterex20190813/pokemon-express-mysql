var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    var rows, fields;
    
    [rows, fields] = await res.locals.connection.execute('SELECT * from users');

    res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
  } catch (err) {
    //console.log(err);
    res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    var rows, fields;
    
    [rows, fields] = await res.locals.connection.execute('SELECT * from users WHERE id=' + req.params.id);

    res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
  } catch (err) {
    //console.log(err);
    res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
});

router.post('/', async function(req, res, next) {
  try {
    // get pokemon data by number
    var response = await fetch('https://pokeapi.co/api/v2/pokemon/' + req.body.pokemon, {
      method: 'GET'
    });
    var pokemonData = await response.json();

    var rows, fields;
    
    [rows, fields] = await res.locals.connection.execute("INSERT INTO pokemons (number, name, image, assigned) VALUES (" + req.body.pokemon + ", '" + pokemonData.name + "', '" + pokemonData.sprites.front_default + "', true);");
    [rows, fields] = await res.locals.connection.execute("SELECT LAST_INSERT_ID();");
    var pokemon = rows[0]['LAST_INSERT_ID()'];

    [rows, fields] = await res.locals.connection.execute("INSERT INTO users (username, password, pokemon) VALUES ('" + req.body.username + "', '" + req.body.password + "', " + pokemon + ");");

    res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    var rows, fields;
    
    [rows, fields] = await res.locals.connection.execute("UPDATE users SET username='" + req.body.username + "', password='" + req.body.password + "', pokemon=" + req.body.pokemon + " WHERE id=" + req.params.id);

    res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
  } catch (err) {
    //console.log(err);
    res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
});

router.put('/catch/:id', async function(req, res, next) {
  try {
      var rows, fields;

      [rows, fields] = await res.locals.connection.execute("SELECT * from pokemons WHERE assigned=false");
      if (rows.length == 0) {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": "No avaliable pokemon" }));
        return;
      }

      var pokemon = rows[0]["id"];
      
      [rows, fields] = await res.locals.connection.execute("SELECT * FROM users WHERE id=" + req.params.id);
      if (rows.length == 0) {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": "User does not exist" }));
        return;
      }

      var oldPokemon = rows[0]["pokemon"];

      [rows, fields] = await res.locals.connection.execute("DELETE FROM pokemons WHERE id=" + oldPokemon);
      [rows, fields] = await res.locals.connection.execute("UPDATE users SET pokemon=" + pokemon + " WHERE id=" + req.params.id);
      [rows, fields] = await res.locals.connection.execute("UPDATE pokemons SET assigned=" + true + " WHERE id=" + pokemon);

      res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
  } catch (err) {
      //console.log(err);
      res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
});

router.delete('/', async function(req, res, next) {
  try {
    var rows, fields;
    
    [rows, fields] = await res.locals.connection.execute("DELETE FROM users");

    res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
  } catch (err) {
    //console.log(err);
    res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    var rows, fields;
    
    [rows, fields] = await res.locals.connection.execute("DELETE FROM users WHERE id=" + req.params.id);

    res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
  } catch (err) {
    //console.log(err);
    res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
});

module.exports = router;
