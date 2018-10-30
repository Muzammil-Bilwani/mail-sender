const express = require('express')
const sgMail = require('@sendgrid/mail');


const app = express()
const port = 3000

app.post('/', (req, res) => {
  try {
    sgMail.setApiKey(req.body.key || process.env.SEND_GRID_API_KEY);
    if (req.body.key) {
      return res.status(400).send({
        message: 'Missing Key'
      })
    }
    const {
      from, to, subject, html
    } = req.body;

    if (from || to || subject || html) {
      return res.status(400).send({
        message: 'Incomplete Params'
      })
    };

    const msg = {
      to,
      from,
      subject,
      html
    };
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
    return res.status(500).json({
      message: 'Something went wrong'
    })
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));