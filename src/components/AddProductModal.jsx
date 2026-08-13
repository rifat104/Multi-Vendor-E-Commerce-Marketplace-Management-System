import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle, UploadCloud, Image as ImageIcon } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose }) => {
  const { addProduct, categories, activeVendorId, vendors } = useApp();

  const currentVendor = vendors.find((v) => v.id === activeVendorId);

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !stock) return;

    addProduct({
      title,
      brand: brand || currentVendor?.name || 'Generic',
      category,
      price,
      originalPrice: originalPrice || price,
      stock,
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description,
    });

    onClose();
    // Reset
    setTitle('');
    setBrand('');
    setPrice('');
    setOriginalPrice('');
    setStock('');
    setImage('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 650, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} style={{ color: 'var(--accent-blue)' }} />
            <h3 className="modal-title">Add New Product to Store Catalog</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Ultra-Slim Gaming Keyboard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Brand Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Keycraft"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price (BDT) *</label>
              <input
                type="number"
                className="form-input"
                required
                placeholder="3500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Price (BDT)</label>
              <input
                type="number"
                className="form-input"
                placeholder="4000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                className="form-input"
                required
                placeholder="20"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* Direct File Upload Area */}
          <div className="form-group">
            <label className="form-label">Upload Product Image (Direct File Upload) *</label>
            <div
              style={{
                border: '2px dashed var(--accent-blue-light)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => document.getElementById('product-image-file-input').click()}
            >
              {image ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={image} alt="Product Preview" style={{ height: 110, borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                  <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>
                    ✓ Image Uploaded Successfully! Click to replace image file.
                  </span>
                </div>
              ) : (
                <div>
                  <UploadCloud size={34} style={{ color: 'var(--accent-blue)', marginBottom: '0.4rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    Click to select & upload image file from your device
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Supports PNG, JPG, WEBP formats (Direct file upload)
                  </div>
                </div>
              )}
              <input
                id="product-image-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageFileChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Key features, specs, warranty details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish Product to Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
