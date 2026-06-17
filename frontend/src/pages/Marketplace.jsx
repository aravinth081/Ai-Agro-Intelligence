 // src/pages/Marketplace.jsx
import React, { useEffect, useState } from 'react';
import { fetchAllLiveData } from '../services/api'; // அந்த API ஃபைலை கூப்பிடுகிறோம்
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Loader2 } from 'lucide-react';

export const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API Call (Fast Version)
    fetchAllLiveData().then(data => {
      setProducts(data.products);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/> Loading Shop...</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
      {products.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex justify-between">
              {item.name}
              <span className={`text-xs px-2 py-1 rounded text-white ${item.stock ? 'bg-green-500' : 'bg-red-500'}`}>
                {item.stock ? 'INSTOCK' : 'NO STOCK'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">{item.price}</p>
            <p className="text-sm text-gray-500 mb-4">{item.category}</p>
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex justify-center gap-2">
              <ShoppingCart size={18} /> Buy Now
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default Marketplace;