import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useWindowContext } from '../Contexts/windowContext';
import DesktopWindow from '../Desktop/Window';
import { WindowProps } from '@/utils/Window';

interface ImgViewerProps extends Omit<WindowProps, 'onOpenViewer'> {
  title: string;
  image: { id: string; src: string; name: string };
}

export default function ImageViewer({ title }: ImgViewerProps) {
  const { isOpen, Images, viewerImage } = useWindowContext();
  const windowId = `visionneuse`;
  if(!viewerImage)
  {
    return(
        <DesktopWindow windowId={windowId} title={title} isVisible={true}>
          <p>Chargement...</p>
        </DesktopWindow>
    )
  }
  const initialIndex = Images.findIndex(img => img.id === viewerImage.id);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  if (!isOpen(windowId)) return null;

  const currentImage = Images[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % Images.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + Images.length) % Images.length);
  };

  useEffect(() => {
    const newIndex = Images.findIndex((img) => img.id === viewerImage.id);
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
    }
  }, [viewerImage, Images]);

  return (
    <DesktopWindow windowId={windowId} title={title} isVisible={true}>
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-md p-4 relative">
        <img
          src={currentImage.src}
          alt={currentImage.name}
          draggable={false}
          className="max-h-[80vh] object-contain rounded-md border border-gray-600"
        />
        <span className="truncate w-full text-center mt-2 text-sm text-gray-300">
          {currentImage.name}
        </span>

        <button onClick={prev} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-gray-700 rounded-full">
          <ChevronLeft />
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-gray-700 rounded-full">
          <ChevronRight />
        </button>
      </div>
    </DesktopWindow>
  );
}
