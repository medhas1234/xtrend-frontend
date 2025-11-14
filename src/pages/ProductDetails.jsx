import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
    console.log("ID from URL:", id);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product || !product._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex justify-center">
      <div className="max-w-4xl bg-white p-6 rounded-xl shadow-lg">
        
        <img
          src={product.image || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full h-80 object-cover rounded-xl mb-4"
        />

        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        <p className="text-gray-600 text-lg">{product.category}</p>

        <p className="text-blue-600 text-2xl font-bold mt-3">
          ₹{product.price}
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}
