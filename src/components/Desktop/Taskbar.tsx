import React from 'react';

export default function Taskbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900 flex items-center px-4 space-x-4">
      {/* Boutons apps ouvertes */}
      <button className="bg-gray-700 px-3 py-1 rounded">Navigateur</button>
      <button className="bg-gray-700 px-3 py-1 rounded">Notes</button>
    </div>
  );
}
