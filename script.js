const path = require('path');
const Joi = require('joi')
const express = require("express");
const hbs = require('hbs')

const app = express();
app.use(express.json());

// *Define paths for express config
const publicDirectoryPath = path.join(__dirname, './public');
const viewPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials') 

// *setup handlebars engine and views location
// tell express which templating engine im gonna use
app.set('view engine', 'hbs');
// Pointing express to my custom directory
app.set('views', viewPath)
// registerPartials take the path to the direcotory where my partials leaves
hbs.registerPartials(partialsPath)

// *Setup Static directory to server
app.use(express.static(path.join(publicDirectoryPath)))

app.get('', (req, res) =>{
  res.render('index', {data: departement})
})

const departement = [{
    id: 1,
    name: "Departement Administratif Et Financier"
  },
  {
    id: 2,
    name: "Departement De la Gestion Urbaine"
  },
  {
    id: 3,
    name: "Departement Des Affaires Juridiqueset Foncieres"
  },
  {
    id: 4,
    name: "Departement Des Etudes"
  }
];

// departement section
app.get("/departement", (req, res) => {
  res.render('departement');
});
app.get("/departement/:id", (req, res) => {
  const depart = departement.find(d => d.id === parseInt(req.params.id));
  if (!depart)
    res.status(404).send("The Departmeent with the given ID was not found");
  res.render( 'departement', {data: depart.name});
});

// services section
const services = [{
  id: 1,
  name: "service1"
}];

app.get("/services", (req, res) => {
  res.render('services');
});


app.post("/services", (req, res) => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const service = {
    id: services.length + 1,
    name: req.body.name
  };
  services.push(service);
  res.render(service);
});
// Page not found
app.get('*', (res, req) =>{
  req.render("404")
});

// Port
var port = process.env.PORT || 3000;
app.listen(port, () => console.log(` Listening on port ${port}...`));