import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PriceChart from './PriceChart';

function CryptoDetails() {
  const { id } = useParams();
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptoDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );
        setCryptoData(response.data);
      } catch (error) {
        console.error('Error fetching cryptocurrency details:', error);
        setError('Could not fetch cryptocurrency details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoDetails();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!cryptoData) {
    return <div>No details available.</div>;
  }

  return (
    <div className="crypto-details">
      <h1>{cryptoData.name} ({cryptoData.symbol.toUpperCase()})</h1>
      <img src={cryptoData.image.large} alt={`${cryptoData.name} logo`} />
      
      <div className="crypto-info">
        <p>Price: ${cryptoData.market_data.current_price.usd}</p>
        <p>Market Cap: ${cryptoData.market_data.market_cap.usd}</p>
        <p>24h Change: {cryptoData.market_data.price_change_percentage_24h}%</p>
      </div>
      
      {/* Display Price Chart */}
      <PriceChart cryptoId={id} />
      
      {/* Optional: Add more details if needed */}
      <div className="more-details">
        <p>Total Volume: ${cryptoData.market_data.total_volume.usd}</p>
      </div>
    </div>
  );
}

export default CryptoDetails;
