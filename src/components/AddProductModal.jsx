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
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file (PNG, JPG, WEBP).');
      }
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

          {/* Drag & Drop + Device Select Upload Area */}
          <div className="form-group">
            <label className="form-label">Upload Product Image (Drag & Drop or Select File) *</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('product-image-file-input').click()}
              style={{
                border: `2px dashed ${isDragging ? 'var(--accent-blue)' : 'var(--accent-blue-light)'}`,
                padding: '1.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                background: isDragging ? '#e0f2fe' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isDragging ? '0 0 15px rgba(2, 132, 199, 0.25)' : 'none',
              }}
            >
              {image ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                  <img src={image} alt="Product Preview" style={{ height: 120, borderRadius: '8px', objectFit: 'cover', border: '2px solid var(--accent-blue-light)' }} />
                  <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 800 }}>
                    ✓ Photo Uploaded Successfully!
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('product-image-file-input').click();
                      }}
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage('');
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <UploadCloud size={40} style={{ color: isDragging ? '#0284c7' : 'var(--accent-blue)', marginBottom: '0.5rem', transition: 'transform 0.2s ease', transform: isDragging ? 'scale(1.15)' : 'scale(1)' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {isDragging ? '📂 Drop your photo file here now!' : '📁 Drag & Drop photo here, or click to select from device'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Supports PNG, JPG, JPEG, WEBP files (Direct upload from phone or computer)
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
