const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// envoie sms programmé
const sendSms = require('./scheduled_sms');
const sendSmsGroupe = require('./groupe_sms');

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Define PORT
const port = 3000;


// Create rappelsms endpoint
app.post('/rappelsms', (req, res) => {
  const { crenauDate, crenauHeureDebut,crenauHeureFin, phone, nom } = req.body;
  const rappelCrenau = {
    crenauDate,
    crenauHeureDebut,
    crenauHeureFin,
    phone,
    nom
  };

  console.log('==> '+ crenauDate)

  const rappelMessage = nom + ", n'oublie pas ta course aujourd'hui de " + crenauHeureDebut + "h à "+ crenauHeureFin + "h. Si tu as un imprévu ...";

  sendSms(rappelCrenau.crenauDate, rappelCrenau.phone, rappelMessage);
  
  res.status(201).send({
    message: 'Envoie du sms programmé confirmée',
    data: (rappelCrenau)
  })
});

// Create notificationCrenau endpoint
app.post('/notificationCrenau', (req, res) => {
  const { role, date, phoneTab } = req.body;
  const message = role + ' viens de rajouter des crénaux pour le ' + date + '. Connectez-vous pour les réserver'
  
  sendSmsGroupe(phoneTab, message);
  
  res.status(201).send({
    message: 'Envoie du sms de groupe confirmée',
    data: (phoneTab)
  })
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// module.exports = app;