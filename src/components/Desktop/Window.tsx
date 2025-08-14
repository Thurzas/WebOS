import React from 'react';
import { motion } from 'framer-motion';
import { WindowProps } from '@/utils/Window';
import { X } from 'lucide-react';
import { useWindowContext } from '../Contexts/windowContext';

interface WindowWithChildrenProps extends WindowProps {
  children?: React.ReactNode;
  windowId: string;
}

export default function DesktopWindow({ title, isVisible, children, windowId }: WindowWithChildrenProps) {
  const { closeWindow} = useWindowContext();

  if (!isVisible) return null;

  return (
  <motion.div
    drag
    dragConstraints={{ left: 0, top: 0, right: 800, bottom: 600 }}
    className="absolute top-20 w-[600px] left-20 overflow-auto bg-gray-800 rounded-md shadow-lg p-3 flex flex-col"
    style={{ touchAction: 'none' }}
  >
    {/* Header */}
    <div>
      <div className="flex justify-between items-center mb-2 text-white">
        <div className="font-bold">{title}</div>
        <button
          onClick={() => closeWindow(windowId)}
          className="text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Contenu qui prend le reste de la hauteur */}
      <div className="overflow-auto flex-1">
        {children}
      </div>
    </div>
  </motion.div>
  );
}
