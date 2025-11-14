import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">X-Trend Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
              >

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.category}</p>
            <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
