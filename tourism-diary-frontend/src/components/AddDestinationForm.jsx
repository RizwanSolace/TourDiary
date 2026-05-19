import React, { useState } from 'react';
import { normalizeImageUrl } from '../utils/imageUtils';

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;

function AddDestinationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    image: '',
    lat: '',
    lng: '',
  });
  const [previewImage, setPreviewImage] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [errors, setErrors] = useState({});

  const imagePreview = previewImage || normalizeImageUrl(formData.image);
  const hasImagePreview = Boolean(imagePreview);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      setPreviewImage('');
      setImageLoadError(false);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Please choose a valid image file',
      }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrors(prev => ({
        ...prev,
        image: 'Please choose an image smaller than 4 MB',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result;
      setPreviewImage(imageDataUrl);
      setImageLoadError(false);
      setFormData(prev => ({
        ...prev,
        image: imageDataUrl,
      }));
      setErrors(prev => ({
        ...prev,
        image: '',
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Place name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Add an image URL or upload an image';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const coordinates = {};
    if (formData.lat.trim()) coordinates.lat = Number(formData.lat);
    if (formData.lng.trim()) coordinates.lng = Number(formData.lng);

    onSubmit({
      name: formData.name.trim(),
      country: formData.country.trim(),
      description: formData.description.trim(),
      image: normalizeImageUrl(formData.image.trim()),
      coordinates,
    });
  };

  return (
    <section className="entry-form-section">
      <h2>Add Tourism Place</h2>
      <p className="section-subtitle">Create a new destination with its photo so it appears in the places list</p>

      <form className="entry-form destination-form" onSubmit={handleSubmit}>
        <div className="destination-form-layout">
          <div className="destination-form-fields">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Place Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Hawa Mahal"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="country">Country *</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Example: India"
                  className={errors.country ? 'input-error' : ''}
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description of the place..."
                rows={5}
                className={errors.description ? 'input-error' : ''}
              ></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL *</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={handleChange}
                placeholder="Paste a tourism place image URL"
                className={errors.image ? 'input-error' : ''}
              />
              <small className="char-count">Or upload an image from your computer below.</small>
              {errors.image && <span className="error-message">{errors.image}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="imageUpload">Upload Image</label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lat">Latitude</label>
                <input
                  type="number"
                  step="any"
                  id="lat"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lng">Longitude</label>
                <input
                  type="number"
                  step="any"
                  id="lng"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {hasImagePreview && (
            <aside className="destination-preview">
              <span className="preview-label">Image Preview</span>
              {imageLoadError ? (
                <div className="destination-preview-empty">
                  Preview unavailable
                </div>
              ) : (
                <img
                  src={imagePreview}
                  alt={formData.name || 'Tourism place preview'}
                  className="destination-preview-image"
                  onError={() => {
                    setImageLoadError(true);
                  }}
                />
              )}
              <div className="preview-copy">
                <h3>{formData.name || 'Your new place'}</h3>
                <p>{formData.country || 'Country'}</p>
              </div>
            </aside>
          )}
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Save Place
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddDestinationForm;
