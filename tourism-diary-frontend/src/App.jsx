import React, { useState, useEffect } from 'react';
import './App.css';
import DestinationList from './components/DestinationList';
import DestinationDetail from './components/DestinationDetail';
import EntryForm from './components/EntryForm';
import AllEntries from './components/AllEntries';
import AddDestinationForm from './components/AddDestinationForm';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [view, setView] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch destinations
  useEffect(() => {
    fetchDestinations();
    fetchEntries();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/destinations`);
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      setDestinations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_BASE}/entries`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  };

  const handleAddEntry = async (entryData) => {
    try {
      const response = await fetch(`${API_BASE}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      if (!response.ok) throw new Error('Failed to add entry');
      const newEntry = await response.json();
      setEntries([...entries, newEntry]);
      setView('entries');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddDestination = async (destinationData) => {
    try {
      const response = await fetch(`${API_BASE}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinationData),
      });
      if (!response.ok) throw new Error('Failed to add destination');
      const newDestination = await response.json();
      setDestinations([...destinations, newDestination]);
      setSelectedDestination(newDestination);
      setView('detail');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await fetch(`${API_BASE}/entries/${entryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete entry');
      setEntries(entries.filter(e => e.id !== entryId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateEntry = async (entryId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update entry');
      const updated = await response.json();
      setEntries(entries.map(e => e.id === entryId ? updated : e));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDestination = (dest) => {
    setSelectedDestination(dest);
    setView('detail');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading your travel memories...</h2>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">✈️ Tourism Diary</h1>
          <p className="app-subtitle">Document your travel adventures</p>
        </div>
        <nav className="nav-buttons">
          <button
            className={`nav-btn ${view === 'destinations' ? 'active' : ''}`}
            onClick={() => setView('destinations')}
          >
            🌍 Destinations
          </button>
          <button
            className={`nav-btn ${view === 'entries' ? 'active' : ''}`}
            onClick={() => setView('entries')}
          >
            📝 All Entries
          </button>
          <button
            className={`nav-btn ${view === 'create' ? 'active' : ''}`}
            onClick={() => setView('create')}
          >
            ✍️ New Entry
          </button>
          <button
            className={`nav-btn ${view === 'addDestination' ? 'active' : ''}`}
            onClick={() => setView('addDestination')}
          >
            Add Place
          </button>
        </nav>
      </header>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button className="close-btn" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="main-content">
        {view === 'destinations' && (
          <DestinationList
            destinations={destinations}
            onSelectDestination={handleViewDestination}
            onAddDestination={() => setView('addDestination')}
          />
        )}

        {view === 'detail' && selectedDestination && (
          <DestinationDetail
            destination={selectedDestination}
            entries={entries.filter(e => e.destinationId === selectedDestination.id)}
            onBack={() => setView('destinations')}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {view === 'entries' && (
          <AllEntries
            entries={entries}
            destinations={destinations}
            onDeleteEntry={handleDeleteEntry}
            onUpdateEntry={handleUpdateEntry}
          />
        )}

        {view === 'create' && (
          <EntryForm
            destinations={destinations}
            onSubmit={handleAddEntry}
            onCancel={() => setView('destinations')}
          />
        )}

        {view === 'addDestination' && (
          <AddDestinationForm
            onSubmit={handleAddDestination}
            onCancel={() => setView('destinations')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Tourism Diary. Keep your travel memories alive.</p>
      </footer>
    </div>
  );
}

export default App;
