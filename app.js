require('dotenv').config()

// api keys
console.log(process.env.PRISMIC_ENDPOINT, process.env.PRISMIC_CLIENT_ID)

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

// requisição para utilizar o CRM da Prismic
const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

// Initialize the prismic.io api
const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ACCESS_TOKEN, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,

    // req: req << esta é a forma legada de implementar o objeto
    req
    // << este é um atalho do ES6
  })
}

const handlelinkResolver = doc => {
  // Define the url depending on the document type
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid;
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid;
  // }

  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handlelinkResolver
  }

  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM

  next()
})

// renderizadores das páginas do site

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', async (req, res) => {
  initApi(req).then(api => {
    api.query(
      Prismic.Predicates.at('document.type', 'homepage')
    ).then(response => {
      console.log(response)
      // response is the response object. Render your views here.
      res.render('pages/about')
    })
  })

  res.render('pages/about')
})

app.get('/collections/', (req, res) => {
  res.render('pages/collections')
})

app.get('/details/:id', (req, res) => {
  res.render('pages/details')
})

app.listen(port, () => {
  console.log(`Aplicação funcionando na porta http://localhost:${port}`)
})
