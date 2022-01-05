require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const port = 8004;

const Prismic = require('@prismicio/client');
var PrismicDOM = require('prismic-dom');
// const { get } = require('express/lib/response');
// no need of a Prismic variable to API endpoint, since we're using dotenv for this. Ref: Luis Bizarro video 'Integrating Prismic with your project: 1h aprox'

// Step 7: connect to the API. Ref: Luis Bizarro video 'Integrating Prismic with your project: 1h08m05s

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}


// step 5: adding a link resolver. Ref: Luis Bizarro video 'Integrating Prismic with your project: 1h05m39s

const handleLinkResolver = doc => {
  // no code for now since we're doing this manually
  return '/'
}

// step 6: create a middleware to add the prismic context.  Ref: Luis Bizarro video 'Integrating Prismic with your project: 1h07m00s

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');

// step 8: add queries to your routes. Ref: Luis Bizarro video 'Integrating Prismic with your project: 1h09m50s (it should be added on each route of express.js below)

app.get('/', async (req, res) => {
  res.render('pages/home');
});

app.get('/about', async (req, res) => {
    initApi(req).then( api => {
      api.query(
        Prismic.Predicates.any('document.type', ['meta', 'about'])
      ).then( response => {
        const { results } = response
        const [ about, meta ] = results
        
        console.log(about, meta)

        // response is the response object. Render your views here
        // res.render('pages/about', {
        //   document: response.results[0]
        // })
        
        res.render('pages/about', {
          about,
          meta
        })

      })
    })
})

app.get('/detail/:uid', async (req, res) => {
    res.render('pages/detail')
})

app.get('/collections', (req, res) => {
    res.render('pages/collections')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
