import React, { useState } from 'react';

function EntryForm({ destinations, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    destinationId: destinations[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    rating: 5,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.destinationId) newErrors.destinationId = 'Please select a destination';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
    setFormData({
      title: '',
      content: '',
      destinationId: destinations[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      rating: 5,
    });
  };

  return (
    <section className="entry-form-section">
      <h2>Create a New Diary Entry</h2>
      <p className="section-subtitle">Share your travel experience and memories</p>

      <form className="entry-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="destination">Destination *</label>
          <select
            id="destination"
            name="destinationId"
            value={formData.destinationId}
            onChange={handleChange}
            className={errors.destinationId ? 'input-error' : ''}
          >
            <option value="">Select a destination</option>
            {destinations.map(dest => (
              <option key={dest.id} value={dest.id}>
                {dest.name}, {dest.country}
              </option>
            ))}
          </select>
          {errors.destinationId && <span className="error-message">{errors.destinationId}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1-5) *</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>
                  {'⭐'.repeat(num)} {num}/5
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Entry Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What was this experience about?"
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Story *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your travel experience, feelings, and memories..."
            rows={8}
            className={errors.content ? 'input-error' : ''}
          ></textarea>
          {errors.content && <span className="error-message">{errors.content}</span>}
          <small className="char-count">{formData.content.length} characters</small>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            💾 Save Entry
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EntryForm;
