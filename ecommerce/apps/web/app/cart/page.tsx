'use client';
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, addPrescription } = useCart();
  const router = useRouter();

  const handlePrescriptionUpload = (itemId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        addPrescription(itemId, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 mb-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p>KES {item.price.toFixed(2)}</p>
                </div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label>Quantity:</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
              </div>

              {item.requiresPrescription && !item.prescriptionImage && (
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Upload Prescription</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handlePrescriptionUpload(item.id, file);
                      }
                    }}
                  />
                </div>
              )}

              {item.prescriptionImage && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">Prescription uploaded ✅</p>
                  <img
                    src={item.prescriptionImage}
                    alt="Prescription"
                    className="w-32 h-auto border mt-1 rounded"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-lg font-semibold">Total: KES {totalAmount.toFixed(2)}</p>
            <button
              onClick={() => router.push('/checkout')}
              className="mt-4 bg-gold text-white px-4 py-2 rounded hover:bg-yellow-500"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
