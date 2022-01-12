require('dotenv').config()

const express = require('express')
const errorHandler = require('errorhandler')
const logger = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const path = require('path')
const port = 8004

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(errorHandler())
app.use(logger('dev'))
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
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
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'about') {
    return '/about'
  }

  if (doc.type === 'collections') {
    return '/collections'
  }
  console.log(doc)
  return '/'
}

// step 6: create a middleware to add the prismic context.  Ref: Luis Bizarro video 'Integrating Prismic with your project: 1h07m00s

app.use((req, res, next) => {
  res.locals.Link = handleLinkResolver

  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM

  // workaroud for the collections numbers
  res.locals.Numbers = index => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }

  next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

const handleRequest = async api => {
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  return {
    meta,
    navigation,
    preloader
  }
}

// step 8: add queries to your routes. Ref: Luis Bizarro video 'Integrating Prismic with your project: 1h09m50s (it should be added on each route of express.js below)

app.get('/', async (req, res) => {
  const api = await initApi(req)

  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')
  const { results: collections } = await api.query(
    Prismic.Predicates.at('document.type', 'collection'),
    { fetchLinks: 'product.image' }
  )

  console.log('home ', home)
  console.log('collections.results ', collections)

  res.render('pages/home', {
    ...defaults,
    api,
    home,
    collections
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)

  const defaults = await handleRequest(api)
  const about = await api.getSingle('about')

  res.render('pages/about', {
    ...defaults,
    about
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  res.render('pages/detail', {
    ...defaults,
    product
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)

  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')
  const { results: collections } = await api.query(
    Prismic.Predicates.at('document.type', 'collection'),
    { fetchLinks: 'product.image' }
  )

  collections.forEach(collection => {
    console.log(collection.data.products[0].products_product)
  })

  res.render('pages/collections', {
    ...defaults,
    home,
    collections
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
