const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const moment = require('moment');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Configuring webpack 
const config = require('../webpack.dev.config');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true}
}));


// Create a short URL from an original long URL
app.get('/new/:original_url', (req, res) => {
  
  // Get the URL
  const original_url = req.params.original_url;
  let short_url = "TO DO";
  
  // Check if the URL is already present in the DB
  
  
  // If the URL is present, return the shortened link
  
  // If the URL is absent, create a random shortened link
  // Check if the shortened link is already present in the DB, if so, try again
  // If the shortened link is not present, add the new entry to the DB, and return the shortened link
  
  
  // Send the shortened link to the user
  res.json({original_url:original_url, short_url:short_url});
});


// Redirect based on the short URL recieved
app.get('/:short_url', (req, res) => {

  const short_url = req.params.short_url;
  let original_url = "to do";
  
  // Find in the DB the original URL
  // original_url = queryResult;
  
  // If an original_url is found, redirect or throw 404
  if (original_url) {
    res.json({original_url:original_url});
  } else {
    res.status(404);
    res.end();
  }
});


// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
