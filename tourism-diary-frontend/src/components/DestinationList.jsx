import React from 'react';
import { FALLBACK_DESTINATION_IMAGE, normalizeImageUrl } from '../utils/imageUtils';

function DestinationList({ destinations, onSelectDestination, onAddDestination }) {
  return (
    <section className="destinations-section">
      <div className="section-heading-row">
        <div>
          <h2>Explore Destinations</h2>
          <p className="section-subtitle">Click on any destination to see diary entries</p>
        </div>
        <button className="add-place-btn" onClick={onAddDestination}>
          Add Tourism Place
        </button>
      </div>

      <div className="destinations-grid">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="destination-card"
            onClick={() => onSelectDestination(dest)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectDestination(dest);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="destination-image-container">
              <img
                src={normalizeImageUrl(dest.image)}
                alt={dest.name}
                className="destination-image"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_DESTINATION_IMAGE;
                }}
              />
              <div className="image-overlay"></div>
            </div>
            <div className="destination-content">
              <h3>{dest.name}</h3>
              <p className="destination-country">{dest.country}</p>
              <p className="destination-description">{dest.description}</p>
              <button className="view-more-btn">View Entries →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DestinationList;
