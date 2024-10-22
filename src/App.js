import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import PriceChart from './PriceChart';
import ReactPaginate from 'react-paginate';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import CryptoDetails from './CryptoDetails';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const fetchCryptos = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`, {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false
          }
        }
      );
      setCryptos(response.data);
      setFilteredCryptos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const searchInput = event.target.value.toLowerCase();
    setSearchTerm(searchInput);

    const filtered = cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(searchInput) || 
      crypto.symbol.toLowerCase().includes(searchInput)
    );

    setFilteredCryptos(filtered);
    setNoResults(filtered.length === 0 && searchInput !== '');
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  const offset = currentPage * itemsPerPage;
  const displayedCryptos = filteredCryptos.slice(offset, offset + itemsPerPage);

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        <header className="App-header">
          <h1>Cryptocurrency Dashboard Tracker</h1>
          <div className="top-bar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search cryptocurrency by name or symbol..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
              Switch to {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </header>

        <div className="crypto-list-container">
          {loading ? (
            <p>Loading cryptocurrencies...</p>
          ) : noResults ? (
            <p>No results found</p>
          ) : (
            <ul className="crypto-list">
              {displayedCryptos.map((crypto) => (
                <li key={crypto.id} className="crypto-item">
                  <img src={crypto.image} alt={`${crypto.name} logo`} className="crypto-image" />
                  <div className="crypto-info">
                    <h2>{crypto.name} ({crypto.symbol.toUpperCase()})</h2>
                    <p>Price: ${crypto.current_price}</p>
                    <p>Market Cap: ${crypto.market_cap}</p>
                    <p>24h Change: {crypto.price_change_percentage_24h}%</p>
                    <p>Trading Volume: ${crypto.total_volume}</p>
                    <Link to={`/crypto/${crypto.id}`}>View Details</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredCryptos.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />

        <Routes>
          <Route path="/crypto/:id" element={<CryptoDetails />} />
        </Routes>

        {filteredCryptos.length > 0 && <PriceChart cryptoId={filteredCryptos[0].id} />}
      </div>
    </Router>
  );
}

export default App;
