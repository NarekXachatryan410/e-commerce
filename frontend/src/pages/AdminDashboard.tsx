import React, { useState, useEffect } from "react";
import { Axios } from "../api/api";
import { env } from "../config/env";
import authService from "../api/services/authService";
import { useNavigate } from "react-router-dom";

type AdminOrder = {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  userId: {
    username: string;
    role: string;
  };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
};

function AdminDashboard() {
  const productCategories = ["Pizza", "Burgers", "Drinks", "Desserts"];
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState(productCategories[0]);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productError, setProductError] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null);

  const sidebarItems = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
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

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setOrdersError("");

      try {
        const response = await Axios.get("/orders");
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrdersError("Failed to load orders.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProductError("");

    if (
      !productTitle.trim() ||
      !productDescription.trim() ||
      !productPrice.trim() ||
      !productCategory.trim() ||
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
      formData.append('category', productCategory.trim());
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
    setProductCategory(productCategories[0]);
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

  const handleDeleteProduct = async (productId: string) => {
    setProductError("");
    setDeletingProductId(productId);

    try {
      await Axios.delete(`/products/${productId}`);
      setProducts((prev) =>
        prev.filter((product) => (product._id || product.id) !== productId),
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
      setProductError("Failed to delete product. Please try again.");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    setOrdersError("");
    setCompletingOrderId(orderId);

    try {
      const response = await Axios.patch(`/orders/${orderId}/complete`);
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? { ...order, status: response.data.data.status }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to complete order:", error);
      setOrdersError("Failed to complete order.");
    } finally {
      setCompletingOrderId(null);
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

              {productError && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {productError}
                </div>
              )}

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
                      <p className="mb-2 inline-block rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                        {product.category || "Uncategorized"}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="font-bold text-orange-600">${product.price}</p>
                        <button
                          onClick={() => handleDeleteProduct(product._id || product.id)}
                          disabled={deletingProductId === (product._id || product.id)}
                          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:opacity-50"
                        >
                          {deletingProductId === (product._id || product.id)
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Orders</h3>

              {ordersError && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {ordersError}
                </div>
              )}

              {loadingOrders ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p>No checked out orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="rounded-lg border p-4 shadow-sm">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Order #{order._id.slice(-6)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            User: {order.userId?.username || "Unknown user"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Role: {order.userId?.role || "unknown"}
                          </p>
                          <p className="font-bold text-orange-600">
                            Total: ${order.totalPrice}
                          </p>
                        </div>
                      </div>

                      <div className="mb-2 text-sm text-gray-600">
                        Status: {order.status}
                      </div>

                      <div className="mb-3 flex justify-end">
                        <button
                          onClick={() => handleCompleteOrder(order._id)}
                          disabled={
                            order.status === "completed" ||
                            completingOrderId === order._id
                          }
                          className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {order.status === "completed"
                            ? "Completed"
                            : completingOrderId === order._id
                              ? "Completing..."
                              : "Complete Order"}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={`${order._id}-${item.productId}`}
                            className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm"
                          >
                            <span>
                              {item.title} x {item.quantity}
                            </span>
                            <span>${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  Category
                </label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  {productCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
