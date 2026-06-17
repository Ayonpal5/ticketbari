import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate('/dashboard'), 2500);
  }, [navigate]);

  return (
    <div className="container"><h2>Payment cancelled</h2><p>Your payment was cancelled. Please try again.</p></div>
  );
};

export default PaymentCancel;
