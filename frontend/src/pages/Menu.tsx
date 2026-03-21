// src/App.tsx
import React, { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

const products: Product[] = [
  { id: 1, name: "Cheese Pizza", price: 8, category: "Pizza", image: "https://source.unsplash.com/400x300/?pizza" },
  { id: 2, name: "Pepperoni Pizza", price: 10, category: "Pizza", image: "https://source.unsplash.com/400x300/?pepperoni" },
  { id: 3, name: "Cola", price: 2, category: "Drinks", image: "https://source.unsplash.com/400x300/?cola" },
  { id: 4, name: "Burger", price: 5, category: "Burgers", image: "https://source.unsplash.com/400x300/?burger" },
  { id: 5, name: "Ice Cream", price: 3, category: "Desserts", image: "https://source.unsplash.com/400x300/?icecream" },
];

const categories = ["All", "Pizza", "Burgers", "Drinks", "Desserts"];

function Menu() {
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => setCart([...cart, product]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Yeremyan Delivery</h1>
          <div className="flex items-center space-x-4">
            {/* Login Button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
              Login
            </button>
            {/* Cart Button */}
            <button className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 transition">
              Cart ({cart.length})
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex space-x-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold border transition ${
              selectedCategory === cat
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-orange-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-40">
              <h3 className="text-lg font-bold">{product.name}</h3>
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

      {/* Mini Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-lg p-4 w-72">
          <h2 className="font-bold text-lg mb-2">Mini Cart</h2>
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {cart.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold text-right">
            Total: ${cart.reduce((acc, item) => acc + item.price, 0)}
          </div>
          <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;