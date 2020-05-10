var express = require('express');
var router = express.Router();
var request = require('sync-request');
var movieModel = require('../models/movies');

var myApi = 'a7428099a225b55929d1dab155bd1ed9';

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

router.get('/new-movies', async function(req, res, next) {

  var result = await request('GET', `https://api.themoviedb.org/3/discover/movie?api_key=${myApi}&language=fr-FR&region=FR&sort_by=popularity.desc&certification_country=France&include_adult=false&include_video=false&page=1&release_date.lte=2020-01-01`)
  var dataResult = JSON.parse(result.body);

  res.json({saveResult: true, movies:dataResult.results});
});

router.post('/wishlist-movies', async function(req, res, next) {

  var newMovie = new movieModel({
    name: req.body.name, 
    img: req.body.img
  });

  var movie = await newMovie.save();

  var saveResult = false;
  if (movie.name) {
    saveResult = true;
  };

  res.json({saveResult});
});

router.delete('/wishlist-movies/:name', async function(req, res, next) {

  var movieDelete = await movieModel.deleteOne({name: req.params.name});

  var saveResult = false;
  if (movieDelete.deletedCount === 1) {
    saveResult = true;
  };

  res.json({saveResult});
});

router.get('/wishlist-movies', async function(req, res, next) {

  var movies = await movieModel.find();

  res.json({movies});
});

module.exports = router;
