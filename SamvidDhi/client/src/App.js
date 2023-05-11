import React, { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';


function App() {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [source, setSource] = useState(null);

  const getExchangeRate = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/currency-exchange?from=${fromCurrency}&to=${toCurrency}`);
      const data = response.data;
     
      if (data) {
        setExchangeRate(data);
      } else {
        console.error('Invalid response data:', data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const convertCurrency = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
      const data = response.data;
     
      setConvertedAmount(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const response = await axios.get('https://api.frankfurter.app/currencies');
        const data = response.data;
        setCurrencies(Object.keys(data));
      } catch (error) {
        console.error(error);
      }
    };
    getCurrencies();
  }, []);
// console.log(convertedAmount)
  return (
    <div className="App">
      <div className="box">
        <div className="title">Currency Exchange App</div>
        <div className="box">
          <label>From Currency:</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="box">
          <label>To Currency:</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="box">
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="buttons">
          <button onClick={getExchangeRate}>Get Exchange Rate</button>
          <button onClick={convertCurrency}>Convert Currency</button>
        </div>
        {exchangeRate && (
          <div className="result">
            <h1>Exchange Rates:</h1>
            {Object.keys(exchangeRate).map((key) => (
              <div key={key}>
                <p>exchange_rate: {exchangeRate[key].exchange_rate}</p>
                <p>Source: {exchangeRate[key].source}</p>
              </div>
            ))}
          </div>
        )}

{convertedAmount && (
  <div className="result">
    <h1>Max Value: {convertedAmount.max_value} {toCurrency}</h1>
    <h1>Min Value: {convertedAmount.min_value} {toCurrency}</h1>
  </div>
)}

      </div>
    </div>
  );
  
}

export default App;
