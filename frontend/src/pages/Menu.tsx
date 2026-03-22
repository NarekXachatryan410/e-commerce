import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Axios } from "../api/api";
import Loading from "../ui/Loading";
import { env } from "../config/env";
import cartService from "../api/services/cartService";
import orderService from "../api/services/orderService";
import type { IUser } from "../types/auth";
import type { ICartItem } from "../types/cart";
import type { ApiResponse } from "../api/types";

type Product = {
  _id: string;
  title: string;
  price: number;
  category: string;
  image: string;
};

function Menu() {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [cartSuccess, setCartSuccess] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await Axios.get("/products");
        setProducts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await Axios.get<ApiResponse<IUser>>("/auth/me");
        setCurrentUser(res.data.data);
      } catch (error) {
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchCart = async () => {
    if (!currentUser) {
      setCart([]);
      return;
    }

    setCartLoading(true);
    try {
      const response = await cartService.getMyCart();
      setCart(response.data.items ?? []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartError("Failed to load cart.");
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const categories = [
    "All",
    ...Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((category) => category && category.trim().length > 0),
      ),
    ),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const addToCart = async (product: Product) => {
    if (!currentUser) {
      setCartError("Please log in before adding items to cart.");
      setCartSuccess("");
      return;
    }

    setCartLoading(true);
    setCartError("");
    setCartSuccess("");

    try {
      const response = await cartService.addItem(product._id);
      setCart(response.data.items ?? []);
      setCartSuccess("Item added to cart.");
    } catch (error: any) {
      if (error.response?.data?.data?.message) {
        setCartError(error.response.data.data.message);
      } else {
        setCartError("Failed to add item to cart.");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setCartLoading(true);
    setCartError("");
    setCartSuccess("");

    try {
      const response = await cartService.removeItem(productId);
      setCart(response.data.items ?? []);
    } catch (error: any) {
      if (error.response?.data?.data?.message) {
        setCartError(error.response.data.data.message);
      } else {
        setCartError("Failed to remove item from cart.");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      setCartError("Please log in before ordering.");
      setCartSuccess("");
      return;
    }

    setCheckoutLoading(true);
    setCartError("");
    setCartSuccess("");

    try {
      await orderService.createOrder();
      setCart([]);
      setToastMessage("Checkout completed");
      setCartSuccess("Order completed.");
    } catch (error: any) {
      if (error.response?.data?.data?.message) {
        setCartError(error.response.data.data.message);
      } else {
        setCartError("Failed to complete order.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">
            Yeremyan Delivery
          </h1>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 transition"
            >
              Sign Up
            </Link>

            <div className="relative" ref={cartRef}>
              <button
                onClick={async () => {
                  const nextOpen = !isOpen;
                  setIsOpen(nextOpen);
                  if (nextOpen && currentUser) {
                    setCartError("");
                    setCartSuccess("");
                    await fetchCart();
                  }
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
              >
                <div className="flex flex-row justify-around h-4 gap-1">
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 z-50 animate-fadeIn">
                  <h2 className="font-bold text-lg mb-2">Cart ({totalItems})</h2>

                  {cartError && (
                    <div className="mb-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {cartError}
                    </div>
                  )}

                  {cartSuccess && (
                    <div className="mb-3 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700">
                      {cartSuccess}
                    </div>
                  )}

                  {!currentUser ? (
                    <p className="text-gray-500 text-sm">Log in to use your cart</p>
                  ) : cartLoading ? (
                    <p className="text-gray-500 text-sm">Loading cart...</p>
                  ) : cart.length === 0 ? (
                    <p className="text-gray-500 text-sm">Cart is empty</p>
                  ) : (
                    <>
                      <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                        {cart.map((item) => (
                          <li
                            key={item.productId}
                            className="py-2 flex items-center justify-between gap-3"
                          >
                            <div>
                              <div>{item.title} x {item.quantity}</div>
                              <div className="text-sm text-gray-500">
                                ${item.price * item.quantity}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-2 font-bold text-right">
                        Total: ${totalPrice}
                      </div>
                      <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        className="mt-3 w-full rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
                      >
                        {checkoutLoading ? "Processing..." : "Checkout"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Products</h2>
        <div className="mb-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-orange-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <main className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={env.VITE_BACKEND_URL + product.image}
                alt={product.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col justify-between h-40">
                <p className="mb-2 inline-block rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                  {product.category || "Uncategorized"}
                </p>
                <h3 className="text-lg font-bold">{product.title}</h3>
                <p className="text-gray-600">${product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </main>
      </section>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[60] rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default Menu;
