import React from 'react';
import { motion } from 'framer-motion';

interface WindowProps {
  title: string;
  images: { id: string; src: string; name: string }[];
  isVisible: boolean;
}

export default function FileExplorer({ title, images, isVisible }: WindowProps) {
  if(!isVisible)
    return;
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, top: 0, right: 800, bottom: 600 }}
      className="absolute top-20 left-20 w-[500px] z-50 h-[400px] bg-gray-800 rounded-md shadow-lg p-3 flex flex-col"
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="font-bold text-white mb-2">{title}</div>

      {/* Gallery area */}
      <div className="bg-gray-700 flex-1 rounded-md p-2 text-sm overflow-auto">
        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="flex flex-col items-center text-white text-xs">
              <img
                src={img.src}
                alt={img.name}
                className="w-16 h-16 object-cover rounded-md border border-gray-600"
              />
              <span className="truncate w-16 text-center mt-1">{img.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
