import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Home, User, Bell, Search, Heart, Star, Folder, FileText } from 'lucide-react';
import { IconDictionary, IIcon } from '@/utils/IconDictionary';
import DesktopIcon from './Icon';
import { useIconContext, } from '../Contexts/IconContext';

interface GizmoProps {
  x: number;
  y: number;
  gridSize: number;
  show: boolean;
}
interface FileIconGridProps {
  containerRect: DOMRect | null;
}
function PositionGizmo({ x, y, gridSize, show }: GizmoProps) {
  if (!show) return null;

  const snapCol = Math.round(x / gridSize);
  const snapRow = Math.round(y / gridSize);
  const snapX = snapCol * gridSize;
  const snapY = snapRow * gridSize;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          position: 'absolute',
          left: snapX,
          top: snapY,
          width: gridSize,
          height: gridSize,
        }}
        className="border-2 border-blue-400 bg-blue-200 bg-opacity-30 rounded-md pointer-events-none z-40"
      >
        <div className="absolute inset-0 border border-blue-300 rounded-md animate-pulse" />
        <div className="absolute top-1 left-1 text-xs text-blue-600 font-mono bg-white px-1 rounded">
          {snapRow},{snapCol}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const FileIconGrid = ({ containerRect }: FileIconGridProps) => {
  const { iconDict, moveIcon, addIcon, removeIcon  } = useIconContext();

  const handleIconDragEnd = (id: string, x: number, y: number) => {
    const col = Math.round(x / gridSize);
    const row = Math.round(y / gridSize);
    moveIcon(id, row, col);

    // Cache le gizmo
    setDragPosition(prev => ({ ...prev, show: false }));
  };
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number; show: boolean }>({
    x: 0,
    y: 0,
    show: false,
  });
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBounds, setContainerBounds] = useState<DOMRect | null>(null);

  const gridSize = 80;
  const iconSize = 64;
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
        if (containerRef.current) {
          setContainerBounds(containerRef.current.getBoundingClientRect());
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.info(iconDict);
  if (!iconDict) {
    return <div className="p-4">Chargement…</div>;
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-gray-900 overflow-hidden">
      <div ref={containerRef} className="relative w-full h-full">
        {iconDict.values().map((icon) => (
          <DesktopIcon
            key={icon.id}
            {...icon}
            onDragEnd={handleIconDragEnd}
            onDrag={(id, x, y) => setDragPosition({ x, y, show: true })}
            gridSize={gridSize}
            iconSize={iconSize}
            containerRect={containerBounds}
            src={icon.src}
          />
        ))}

        <PositionGizmo
          x={dragPosition.x}
          y={dragPosition.y}
          gridSize={gridSize}
          show={dragPosition.show}
        />
      </div>
    </div>
  );
};

export default FileIconGrid;
