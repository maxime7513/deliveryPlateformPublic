const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// envoie sms programmé
const sendSms = require('./scheduled_sms');

// Express settings
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Define PORT
const port = 3000;


// Create users endpoint
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
    data: rappelCrenau
  })
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// module.exports = app;