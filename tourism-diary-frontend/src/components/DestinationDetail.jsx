import React from 'react';
import { FALLBACK_DESTINATION_IMAGE, normalizeImageUrl } from '../utils/imageUtils';

function DestinationDetail({ destination, entries, onBack, onDeleteEntry }) {
  return (
    <section className="destination-detail">
      <button className="back-btn" onClick={onBack}>← Back to Destinations</button>

      <div className="detail-header">
        <div className="detail-image-container">
          <img
            src={normalizeImageUrl(destination.image)}
            alt={destination.name}
            className="detail-image"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_DESTINATION_IMAGE;
            }}
          />
        </div>
        <div className="detail-info">
          <h1>{destination.name}</h1>
          <h2 className="detail-country">{destination.country}</h2>
          {destination.coordinates && (
            <p className="coordinates">
              📍 {destination.coordinates.lat}, {destination.coordinates.lng}
            </p>
          )}
          <p className="detail-description">{destination.description}</p>
          <div className="entry-count">
            <span className="count-badge">{entries.length}</span>
            <span>diary entries from this destination</span>
          </div>
        </div>
      </div>

      <div className="entries-section">
        <h2>Diary Entries</h2>
        {entries.length === 0 ? (
          <p className="no-entries">No diary entries yet. Start by creating one!</p>
        ) : (
          <div className="entries-list">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <h3>{entry.title}</h3>
                  <div className="entry-meta">
                    <span className="entry-date">📅 {new Date(entry.date).toLocaleDateString()}</span>
                    <span className="entry-rating">⭐ {entry.rating}/5</span>
                  </div>
                </div>
                <p className="entry-content">{entry.content}</p>
                {entry.photos && entry.photos.length > 0 && (
                  <div className="entry-photos">
                    {entry.photos.map((photo, idx) => (
                      <img key={idx} src={photo} alt={`Entry ${idx}`} className="entry-photo" />
                    ))}
                  </div>
                )}
                <button
                  className="delete-btn"
                  onClick={() => onDeleteEntry(entry.id)}
                >
                  🗑️ Delete Entry
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DestinationDetail;
