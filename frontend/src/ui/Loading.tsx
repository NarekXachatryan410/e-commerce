import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex space-x-2 animate-bounce">
        <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
        <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
        <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
      </div>
    </div>
  );
}

export default Loading;