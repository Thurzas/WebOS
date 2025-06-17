import React from 'react';
import { motion } from 'framer-motion';

interface WindowProps {
  title: string;
}

export default function Window({ title }: WindowProps) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, top: 0, right: 800, bottom: 600 }}
      className="absolute top-20 left-20 w-96 z-50 h-64 bg-gray-800 rounded-md shadow-lg p-4"
      style={{ touchAction: 'none' }}
    >
      <div className="font-bold mb-2">{title}</div>
      <div className="bg-gray-700 flex-1 rounded-md p-2 text-sm">
        Contenu de l’application {title}
      </div>
    </motion.div>
  );
}
