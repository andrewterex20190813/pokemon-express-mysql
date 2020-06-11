var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

router.get('/', async function(req, res, next) {
    try {
        var rows, fields;
        
        [rows, fields] = await res.locals.connection.execute('SELECT * from pokemons');

        res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
    } catch (err) {
        //console.log(err);
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        var rows, fields;
        
        [rows, fields] = await res.locals.connection.execute('SELECT * from pokemons WHERE id=' + req.params.id);

        res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
    } catch (err) {
        //console.log(err);
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
});

router.post('/', async function(req, res, next) {
    try {
        var response = await fetch('https://pokeapi.co/api/v2/pokemon/' + req.body.number, {
            method: 'GET'
        });
        var pokemonData = await response.json();
        
        var rows, fields;

        [rows, fields] = await res.locals.connection.execute("INSERT INTO pokemons (number, name, image, assigned) VALUES (" + req.body.number + ", '" + pokemonData.name + "', '" + pokemonData.sprites.front_default + "', false);");

        res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
    } catch (err) {
        console.log(err);
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
});

router.put('/:id', async function(req, res, next) {
    try {
        var rows, fields;
        
        //[rows, fields] = await res.locals.connection.execute("UPDATE pokemons SET number=" + req.body.number + " WHERE id=" + req.params.id);

        res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
    } catch (err) {
        //console.log(err);
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
});

router.delete('/', async function(req, res, next) {
    try {
        var rows, fields;
        
        [rows, fields] = await res.locals.connection.execute("DELETE FROM pokemons");

        res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
    } catch (err) {
        //console.log(err);
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
});

router.delete('/:id', async function(req, res, next) {
    try {
        var rows, fields;
        
        [rows, fields] = await res.locals.connection.execute("DELETE FROM pokemons WHERE id=" + req.params.id);

        res.send(JSON.stringify({ "status": 200, "error": null, "response": rows }));
    } catch (err) {
        //console.log(err);
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
});

module.exports = router;
