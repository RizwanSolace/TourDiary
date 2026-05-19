import React, { useState } from 'react';

function AllEntries({ entries, destinations, onDeleteEntry, onUpdateEntry }) {
  const [filterDestination, setFilterDestination] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const destinationMap = destinations.reduce((acc, d) => {
    acc[d.id] = d;
    return acc;
  }, {});

  let filteredEntries = entries;
  if (filterDestination !== 'all') {
    filteredEntries = entries.filter(e => e.destinationId === filterDestination);
  }

  filteredEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'title-a-z':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditData({
      title: entry.title,
      content: entry.content,
      rating: entry.rating,
    });
  };

  const handleSaveEdit = (entryId) => {
    onUpdateEntry(entryId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <section className="all-entries-section">
      <h2>All Diary Entries</h2>
      <p className="section-subtitle">Browse and manage all your travel memories</p>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="filter">Filter by destination:</label>
          <select
            id="filter"
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Destinations</option>
            {destinations.map(dest => (
              <option key={dest.id} value={dest.id}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
            <option value="title-a-z">Title (A-Z)</option>
          </select>
        </div>

        <div className="entry-stats">
          Showing {filteredEntries.length} of {entries.length} entries
        </div>
      </div>

      <div className="entries-timeline">
        {filteredEntries.length === 0 ? (
          <div className="no-entries-message">
            <p>📭 No entries found. Start documenting your travel adventures!</p>
          </div>
        ) : (
          filteredEntries.map((entry, index) => (
            <div key={entry.id} className="timeline-item">
              <div className="timeline-marker"></div>

              {editingId === entry.id ? (
                <div className="entry-edit-form">
                  <h3>Edit Entry</h3>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    placeholder="Title"
                    className="edit-input"
                  />
                  <textarea
                    value={editData.content}
                    onChange={(e) => setEditData({...editData, content: e.target.value})}
                    placeholder="Content"
                    rows={4}
                    className="edit-input"
                  ></textarea>
                  <select
                    value={editData.rating}
                    onChange={(e) => setEditData({...editData, rating: parseInt(e.target.value)})}
                    className="edit-input"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>
                        {'⭐'.repeat(num)} {num}/5
                      </option>
                    ))}
                  </select>
                  <div className="edit-buttons">
                    <button
                      onClick={() => handleSaveEdit(entry.id)}
                      className="save-edit-btn"
                    >
                      ✓ Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-edit-btn"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="entry-card-timeline">
                  <div className="entry-header">
                    <h3>{entry.title}</h3>
                    {destinationMap[entry.destinationId] && (
                      <span className="entry-location">
                        📍 {destinationMap[entry.destinationId].name}
                      </span>
                    )}
                  </div>

                  <div className="entry-meta-inline">
                    <span className="entry-date">📅 {new Date(entry.date).toLocaleDateString()}</span>
                    <span className="entry-rating">⭐ {entry.rating}/5</span>
                  </div>

                  <p className="entry-content">{entry.content}</p>

                  {entry.photos && entry.photos.length > 0 && (
                    <div className="entry-photos-grid">
                      {entry.photos.map((photo, idx) => (
                        <img key={idx} src={photo} alt={`Entry ${idx}`} className="entry-photo-thumb" />
                      ))}
                    </div>
                  )}

                  <div className="entry-actions">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AllEntries;
