import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentQR({ amount, onSuccess, onCancel, serviceDetails }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setCurrentStep(prev => prev < 4 ? prev + 1 : prev);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    // Simulate payment processing and store subscription
    setTimeout(() => {
      // Store subscription details in localStorage
      const currentSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      const newSubscription = {
        id: Date.now(),
        service: serviceDetails.servicename,
        status: 'Active',
        amount: amount,
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        image: serviceDetails.image || `https://images.unsplash.com/photo-${serviceDetails.cuisinetype === 'South Indian' ? '1630383249896-424e482df921' : '1585937421612-70a008356fbe'}?auto=format&fit=crop&q=80&w=300`,
        plan: amount > 10000 ? 'Yearly' : 'Monthly',
        mealPreferences: serviceDetails.cuisinetype,
        deliveryAddress: 'Room 304, Block B, Student Housing'
      };
      localStorage.setItem('subscriptions', JSON.stringify([...currentSubscriptions, newSubscription]));
      
      setIsProcessing(false);
      onSuccess && onSuccess();
      navigate('/subscriptions');
    }, 3000);
  };

  return (
    <div className="payment-modal">
      <div className="payment-content">
        <div className="payment-header">
          <h3>Complete Payment</h3>
          {!isProcessing && (
            <button className="close-btn" onClick={onCancel}>×</button>
          )}
        </div>

        {isProcessing ? (
          <div className="processing-status">
            <div className="processing-spinner"></div>
            <div className="processing-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                Verifying Payment
                {currentStep === 1 && <span className="animate-dots">...</span>}
                {currentStep > 1 && <span className="check-mark">✓</span>}
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                Confirming Subscription
                {currentStep === 2 && <span className="animate-dots">...</span>}
                {currentStep > 2 && <span className="check-mark">✓</span>}
              </div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                Updating Dashboard
                {currentStep === 3 && <span className="animate-dots">...</span>}
                {currentStep > 3 && <span className="check-mark">✓</span>}
              </div>
              <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                Redirecting
                {currentStep === 4 && <span className="animate-dots">...</span>}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="amount-display">
              <div className="amount-label">Amount to Pay</div>
              <div className="amount-value">₹{amount.toLocaleString('en-IN')}</div>
              <div className="amount-info">{amount > 10000 ? 'Yearly Plan' : 'Monthly Plan'}</div>
            </div>
            
            <div className="qr-container">
              <div className="qr-wrapper">
                <img 
                  src={require('./gpayy.jpg')}
                  alt="GPay QR Code" 
                  className="qr-code"
                />
              </div>
              <div className="qr-instructions">
                <p>1. Open your GPay app</p>
                <p>2. Tap 'Scan QR' or 'Pay'</p>
                <p>3. Point your camera at this code</p>
                <p>4. Confirm the payment of ₹{amount}</p>
              </div>
            </div>

            <div className="payment-actions">
              <button 
                className="btn primary confirm-btn" 
                onClick={handlePaymentSuccess}
              >
                I have completed the payment
              </button>
              <button 
                className="btn secondary cancel-btn"
                onClick={onCancel}
              >
                Cancel Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}