'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrescriptionUpload from '@/components/PrescriptionUpload';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !email || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    const missingPrescription = cart.find(
      (item) => item.requiresPrescription && (!item.prescriptionImage || item.prescriptionImage.length === 0)
    );

    if (missingPrescription) {
      alert(`Prescription required for: ${missingPrescription.name}`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/payment/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          email,
          phone,
          paymentMethod,
          amount: totalAmount,
          cartItems: cart,
        }),
      });

      if (!res.ok) throw new Error('Payment failed');

      clearCart();
      alert('Order placed successfully!');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × KES {item.price.toFixed(2)}
                      </p>

                      {item.requiresPrescription && (
                        <div className="mt-2 space-y-1">
                          <PrescriptionUpload productId={item.id} />
                          {(!item.prescriptionImage || item.prescriptionImage.length === 0) && (
                            <p className="text-red-500 text-xs">❗ Prescription required</p>
                          )}
                          {item.prescriptionImage && item.prescriptionImage.length > 0 && (
                            <ul className="text-green-600 text-xs list-disc pl-4 space-y-1">
                              {item.prescriptionImage.map((img, i) => (
                                <li key={i}>✅ Uploaded: {img.name || 'Image'}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold">
                      KES {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold pt-2">
              Total: KES {totalAmount.toFixed(2)}
            </div>
          </>
        )}
      </div>

      {/* Customer Info & Payment */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Customer Information</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number (e.g. 254712345678)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 border p-3 rounded-lg flex-1">
              <input
                type="radio"
                checked={paymentMethod === 'mpesa'}
                onChange={() => setPaymentMethod('mpesa')}
              />
              <span>M-Pesa</span>
            </label>
            <label className="flex items-center gap-2 border p-3 rounded-lg flex-1">
              <input
                type="radio"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                disabled
              />
              <span>Card (Coming Soon)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || cart.length === 0}
          className={`w-full py-3 text-white rounded-lg transition ${
            submitting || cart.length === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
