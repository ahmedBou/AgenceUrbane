const path = require('path');
const express = require("express");
const hbs = require('hbs');
const fs = require('fs');
var bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
// *Define paths for express config
const publicDirectoryPath = path.join(__dirname, './public');
// console.log(__dirname);



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

// HomePage
app.get('', (req, res) => {
  res.render('index')
})

// *************************************************************************
// Department section
// Read and write data from json
// get all departement
var data = fs.readFileSync('departement.json')
var arrayOfObjects = JSON.parse(data)
app.get('/departement', (req, res) => {
  res.render('departement', {isData: arrayOfObjects})
})

app.post('/departement', (req, res) => {
  var addDepartement = req.body.txtName;
  var an_id = 0
  if (!arrayOfObjects[arrayOfObjects.length - 1].id) {
    an_id = arrayOfObjects[arrayOfObjects.length - 1].id + 1
  }

  arrayOfObjects.push({
    "id": an_id,
    "name": addDepartement
  })

  const arrayJson = JSON.stringify(arrayOfObjects, null, 2)

  fs.writeFile('departement.json', arrayJson, 'utf-8', function (err) {
    if (err) throw err
    console.log('Done!')
  })

  res.render('departement', {
    isData: arrayOfObjects
  })
})

// get a single one
app.get("/departement/:id", (req, res) => {
  const depart = arrayOfObjects.find(d => d.id === parseInt(req.params.id));
  // if departement doesn't have a value
  if (!depart)
    res.status(404).send("The Departement with the given ID was not found");
  res.render('departement', {
    datas: depart.name
  });
});
// end of dep section

// ************************************************************************************
// Reclamation Section:
app.get('/message', (req, res) => {
  res.render('message', {
    datas: arrayOfObjects
  })
})
app.post('/message', (req, res) => {
  let data = fs.readFileSync('message.json')
  let message = req.body.txtMsg;
  let serviceM = req.body.service;
  var reclamation = JSON.parse(data);
  var an_id = 0;
  if (!reclamation[reclamation.length - 1].id) {
    an_id = reclamation[reclamation.length - 1].id + 1
  }
  reclamation.push({
    'id': an_id,
    'a_msg': message,
    'name_departement': serviceM
  })
  const messageJson = JSON.stringify(reclamation, null, 2)
  fs.writeFile('message.json', messageJson, 'utf-8', function (err) {
    if (err) throw err
    console.log('Done!')
  })
  res.render('message', {
    reclamation: reclamation,
    datas: arrayOfObjects
  })
})
// end of rec section

// Page not found
app.get('*', (res, req) => {
  req.render("404")
});

// Port
app.listen(3000);