//.env permite puxar variáveis de um arquivo .env para o arquivo onde a função abaixo é utilizada. Serve para evitar subir chaves APIs em repositórios e causar vulnerabilidades de segurança
require('dotenv').config()

// documentação do CRM Prismic disponível em: https://prismic.io/docs/technologies/integrating-with-an-existing-project-nodejs

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
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
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
  	// o programa vai pegar todo o conteúdo que tenha o match abaixo: documentos com o type 'about' do Prismic
    api.query(
      Prismic.Predicates.at('document.type', 'about')
    )
    // aí ele pega tudo o que achou e manda para o caminho do método render, ou seja, a pages/about
    .then(response => {

    	const { results } = response
    	const [about] = results

    	about.data.gallery.forEach(media => {
    		console.log(media)
    	})

      console.log(about)

      res.render('pages/about', {
      	about
      })
    })

  })
})

app.get('/collections/', (req, res) => {
  res.render('pages/collections')
})

app.get('/details/:uid', (req, res) => {
  res.render('pages/details')
})

app.listen(port, () => {
  console.log(`Aplicação funcionando na porta http://localhost:${port}`)
})
