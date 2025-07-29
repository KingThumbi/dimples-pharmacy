import Link from 'next/link';
import { FaSearch, FaPrescriptionBottleAlt } from 'react-icons/fa';
import Image from 'next/image';

// Mock product data - replace with real API calls
const products = [
  {
    id: 'DPL001',
    name: 'Panadol Extra',
    price: 120,
    requiresPrescription: false,
    category: 'Pain Relief',
    image: '/products/panadol.jpg'
  },
  {
    id: 'DPL002',
    name: 'Amoxicillin 500mg',
    price: 350,
    requiresPrescription: true,
    category: 'Antibiotics',
    image: '/products/amoxicillin.jpg'
  },
  // Add more products...
];

export default function ProductListing() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Pharmacy Products</h1>
        <p className="text-gray-600">Quality medications at competitive prices</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search medications..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select className="border rounded-lg px-4 py-2">
          <option value="">All Categories</option>
          <option value="pain">Pain Relief</option>
          <option value="antibiotics">Antibiotics</option>
          {/* Add more categories */}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
              {product.requiresPrescription && (
                <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center">
                  <FaPrescriptionBottleAlt className="mr-1" />
                  Prescription
                </div>
              )}
            </div>
            <div className="p-4">
              <span className="text-sm text-blue-600">{product.category}</span>
              <h3 className="font-semibold text-lg my-1">{product.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-gray-800">KES {product.price.toLocaleString()}</span>
                <Link 
                  href={`/products/${product.id}`} 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {product.requiresPrescription ? 'View Details' : 'Add to Cart'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}