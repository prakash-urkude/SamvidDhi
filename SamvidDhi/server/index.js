const express = require('express');
const axios = require('axios');
const cors = require('cors')
const app = express();
const host = 'api.frankfurter.app';

// Allow cross-origin requests
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Endpoint to get currency exchange rates
app.get('/currency-exchange', async (req, res) => {
  const { from, to } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  try {
    const response = await axios.get(`https://${host}/latest?from=${from}&to=${to}`);
    const exchangeRate = response.data.rates[to];
    // console.log(exchangeRate)
    res.json({
      exchange_rate: exchangeRate,
      source: host
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get exchange rate' });
  }
});

// Endpoint to convert currency
app.get('/convert', async (req, res) => {
  const { from, to, amount } = req.query;
  
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  try {
    const response = await axios.get(`https://${host}/latest?from=${from}&to=${to}`);
    const exchangeRate = response.data.rates[to];
    const convertedAmount = parseFloat(amount) * exchangeRate;
    
    return res.status(200).send({
      status: true,
      message: "Currency converted successfully",
      data: {
        converted_amount: convertedAmount,
        source: host
      }
    });
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log('Server started on port ' + (3001));
});
