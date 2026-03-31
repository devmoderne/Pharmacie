import React from 'react';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
}
