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
    const response1 = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    const exchangeRate1 = response1.data.rates[to];
    const response2 = await axios.get(`https://free.currconv.com/api/v7/convert?q=${from}_${to}&compact=ultra&apiKey=516bf8ef65265e6f4e93`);
    const exchangeRate2 = response2.data[`${from}_${to}`];

    const exchangeRates = [
      { exchange_rate: exchangeRate1, source: 'api.frankfurter.app' },
      { exchange_rate: exchangeRate2, source: 'https://free.currconv.com' }
    ];
    console.log(exchangeRates)
    res.json(exchangeRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get exchange rates' });
  }
});

app.get('/convert', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // console.log(from,to)
    const response = await axios.get(`http://localhost:3001/currency-exchange?from=${from}&to=${to}`);
    // console.log(response.data)
    const exchangeRates = response.data;
    let maxConvertedAmount = 0;
    let minConvertedAmount = Number.MAX_SAFE_INTEGER;

    exchangeRates.forEach(rate => {
      const convertedAmount = parseFloat(amount) * rate.exchange_rate;

      if (convertedAmount > maxConvertedAmount) {
        maxConvertedAmount = convertedAmount;
      }

      if (convertedAmount < minConvertedAmount) {
        minConvertedAmount = convertedAmount;
      }
    });

    // console.log(maxConvertedAmount,minConvertedAmount)
    res.status(200).send({
      max_value: maxConvertedAmount,
      min_value: minConvertedAmount
    });
  } catch (error) {
    console.error("error");
    res.status(500).json({ error: 'Failed to convert currency' });
  }
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log('Server started on port ' + (3001));
});
