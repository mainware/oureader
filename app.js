var express = require('express');
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./app/models/movie')
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/chsh'
var bodyParser = require('body-parser')

mongoose.connect(dbUrl)

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended:true}))
app.locals.moment = require('moment')
app.listen(port);

console.log('chshapp started on port 3000');

// index page
app.get('/', function(req, res) {
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}
		res.render('index', {
			title: 'chsh index page',
			movies: movies
		})
	})
});

// detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
		if (err) {
			console.log(err)
		}

		res.render('detail', {
			title: 'chsh ' + movie.title,
			movie: movie
		})
	})
});

// admin input page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'chsh 后台录入页',
		movie: {
			title: '',
			director: '',
			country: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	})
});

//app admin update, 从list点【更新】
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'chsh 后台更新页',
				movie: movie
			})
		})
	}
})

//admin post
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if (id !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}

				res.redirect('/movie/'+movie._id)
			})
		})
	}
	else {
		_movie = new Movie ({
					director: movieObj.director,
					title: movieObj.title,
					country: movieObj.country,
					language: movieObj.language,
					year: movieObj.year,
					poster: movieObj.poster,
					summary: movieObj.summary,
					flash: movieObj.flash
				})

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}

			res.redirect('/movie/'+movie._id)
		})
	}
})

// list page
app.get('/admin/list', function(req, res) {
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err)
		}

		res.render('list', {
			title: 'chsh list page',
			movies: movies
		})
	})
});