import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("xtrend-user"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for Add/Edit
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  // ADMIN PROTECTION
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-red-600 text-xl font-semibold">
          Access Denied — Admins Only
        </h2>
      </div>
    );
  }

  const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("xtrend-user"));
  return user && user.token
    ? { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
        };
  
  // Fetch all products
  
const loadProducts = async () => {
  try {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/products");
    if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
    const data = await res.json();
    setProducts(data);
  } catch (err) {
    console.error("loadProducts error:", err);
    alert("Could not load products. Check console for details.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const headers = getAuthHeaders();
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(err.message || `Delete failed: ${res.status}`);
    }

    // refresh list
    await loadProducts();
  } catch (err) {
    console.error("Delete error:", err);
    alert("Delete failed: " + err.message);
  }
};

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/products/${editId}`
      : `http://localhost:5000/api/products`;

    const headers = getAuthHeaders();

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `Request failed: ${res.status}`);
    }

    // Reset form and reload
    setForm({ name: "", category: "", price: "", image: "", description: "" });
    setEditId(null);
    await loadProducts();
  } catch (err) {
    console.error("Submit error:", err);
    alert("Save failed: " + err.message);
  }
};

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* ADD / EDIT FORM */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-lg">
        <h2 className="text-xl font-semibold mb-3">
          {editId ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
          />

          <textarea
            className="border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <button className="bg-blue-600 text-white py-2 rounded">
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded shadow flex flex-col"
          >
            <img
              src={product.image}
              className="h-40 w-full object-cover rounded mb-3"
            />

            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.category}</p>
            <p className="text-blue-600 font-bold">₹{product.price}</p>

            <div className="mt-3 flex justify-between">
              <button
                onClick={() => handleEdit(product)}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(product._id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
