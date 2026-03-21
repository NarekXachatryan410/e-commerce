import React, { useState, useEffect } from "react";
import { Axios } from "../api/api";
import { env } from "../config/env";
import authService from "../api/services/authService";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productError, setProductError] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "settings", label: "Settings" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await Axios.get("/products");
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProductError("");

    if (
      !productTitle.trim() ||
      !productDescription.trim() ||
      !productPrice.trim() ||
      !productImage
    ) {
      setProductError("Please fill all fields and choose an image.");
      return;
    }

    // TODO: send to API
    try {
      const formData = new FormData();
      formData.append('title', productTitle.trim());
      formData.append('description', productDescription.trim());
      formData.append('price', productPrice.trim());
      formData.append('image', productImage);

      const response = await Axios.post("/products", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Add the new product to the list
        setProducts(prev => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      setProductError("Failed to add product. Please try again.");
      return;
    }

    setShowAddProductModal(false);
    setProductTitle("");
    setProductDescription("");
    setProductPrice("");
    setProductImage(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-center border-b">
          <h1 className="text-xl font-bold text-orange-600">Admin Panel</h1>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2 my-1 rounded-lg font-medium transition hover:bg-orange-100 ${
                activeTab === item.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
          {activeTab === "dashboard" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Welcome, Admin!</h3>
              <p>Here you can manage products, orders, and settings.</p>
            </div>
          )}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Products</h3>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
                >
                  Add Product
                </button>
              </div>

              {loadingProducts ? (
                <p>Loading products...</p>
              ) : products.length === 0 ? (
                <p>No products found. Add your first product!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product._id || product.id} className="border rounded-lg p-4 shadow-sm">
                      {product.image && (
                        <img
                          src={`${env.VITE_BACKEND_URL}${product.image}`}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      <h4 className="font-semibold">{product.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <p className="font-bold text-orange-600">${product.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Orders</h3>
              <p>View and manage orders here.</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p>Configure admin settings here.</p>
            </div>
          )}
        </div>
      </main>

      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Add Product</h3>

            <form className="space-y-3" onSubmit={handleAddProduct}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductImage(e.target.files?.[0] ?? null)}
                  className="mt-1 w-full"
                />
              </div>

              {productError && (
                <div className="text-sm text-red-600">{productError}</div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
