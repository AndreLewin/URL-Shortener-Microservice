const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const mongoose = require('mongoose');
const validUrl = require('valid-url');

const UrlPair = require('./model/UrlPair');
mongoose.connect(process.env.DB_URI, { useMongoClient: true });
mongoose.Promise = global.Promise; 

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
app.get('/new/*', async (req, res) => {
  
  // Get the URL
  const original_url = req.params[0];
  let short_url = "";

  // Check the validity of the URL
  if (!validUrl.isUri(original_url)) {
    res.status(400).json({ error: 'Please add a valid URL after /new/'});
    res.end();
  } else {

    // If the URL is present, return the shortened link
    const urlPairMatch = await UrlPair.findOne({"original_url": original_url});
    if (urlPairMatch) {
      short_url = urlPairMatch.short_url;
    }

    // If the URL is absent, create a random shortened link
    // Check if the shortened link is already present in the DB, if so, try again
    else {
      let randomNumber = Math.floor(Math.random() * 1000000);
      for (let i=0; i < 10; i++) {
        if (!(await UrlPair.findOne({"short_url": randomNumber}))) { break };
        randomNumber = Math.floor(Math.random() * 1000000);
      }

      short_url = randomNumber;

      // Add the new pair to the database
      const urlPair = new UrlPair({ original_url:original_url , short_url:short_url });
      urlPair.save();
    }

    // Display the original and short links for the user
    res.json({
      original_url:req.protocol + '://' + req.hostname + '/new/' + original_url,
      short_url:req.protocol + '://' + req.hostname + '/' + short_url
    });
  };
});


// Redirect based on the short URL recieved
app.get('/:short_url', async (req, res) => {

  const short_url = req.params.short_url;
  
  // Find in the DB the original URL
  const original_pair = await UrlPair.findOne({ short_url: short_url });
  
  if (original_pair) {
    res.redirect(original_pair.original_url);
  } else {
    res.status(404).json({ error: 'No URL found for this short code'});
    res.end();
  }
});


// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
