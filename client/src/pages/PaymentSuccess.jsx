import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingId) return;
    api.post('/payments/confirm', { bookingId }).then(() => {
      navigate('/dashboard');
    }).catch(() => {
      navigate('/dashboard');
    });
  }, [bookingId, navigate]);

  return (
    <div className="container"><h2>Payment successful</h2><p>Thank you! Your booking is now paid.</p></div>
  );
};

export default PaymentSuccess;
