import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, product, onSuccessReview }) => {
  const { addReview, showAlert } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;

    const res = await addReview({
      productId: product.productId || product.id,
      orderId: product.orderId || 'N/A',
      rating,
      comment,
    });

    if (res && !res.success) {
      showAlert('Review Submission Limit', `❌ ${res.message}`, 'error');
      return;
    }

    showAlert('Review Submitted', '✓ Thank you! Your product review has been submitted successfully.', 'success');
    if (onSuccessReview) {
      onSuccessReview(product.orderId);
    }
    onClose();
    setComment('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Rate & Review Product</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}
            />
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>{product.title}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Seller: {product.vendorName}</div>
          </div>

          <div className="form-group" style={{ textAlign: 'center' }}>
            <label className="form-label">Your Rating</label>
            <div style={{ display: 'flex', justifyCenter: 'center', gap: '0.5rem', justifyContent: 'center', margin: '0.5rem 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ color: star <= rating ? 'var(--accent-amber)' : 'var(--text-dim)', transition: 'var(--transition)' }}
                >
                  <Star size={28} fill={star <= rating ? 'var(--accent-amber)' : 'none'} />
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Below Expectations'}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Written Feedback / Review</label>
            <textarea
              className="form-textarea"
              rows={3}
              required
              placeholder="Tell other buyers about product quality, packaging, delivery speed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Product Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
