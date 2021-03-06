const express = require('express')
const sgMail = require('@sendgrid/mail');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config()

const app = express()

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('API WORKING'));

app.post('/api/mail', (req, res) => {
  try {
    sgMail.setApiKey(req.body.key);
    if (!req.body.key) {
      return res.status(400).send({
        message: 'Missing Key'
      })
    }
    const {
      from, to, subject, html, text
    } = req.body;

    if (!from && !to && !subject && !html && !text) {
      console.error('Incomplete Params');
      return res.status(400).send({
        message: 'Incomplete Params'
      })
    };

    const msg = {
      to,
      from,
      subject,
      text,
      html
    };
    console.info(msg);
    sgMail.send(msg).then(
      result => {
        return res.status(200).send({
          message: 'Mail Send'
        })
      },
      error => {
        return res.status(500).send({
          message: 'Incomplete Params',
          error
        })
      }
    );

  }
  catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Something went wrong'
    })
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));