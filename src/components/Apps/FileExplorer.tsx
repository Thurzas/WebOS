import { useEffect, useRef, useState } from 'react';
import { WindowProps } from '@/utils/Window';
import { IIcon } from '@/utils/IconDictionary';
import { motion } from 'framer-motion';
import FileIconGrid from '../Desktop/FileIconGrid';
import { IconProvider, useIconContext } from '../Contexts/IconContext';
import { X } from 'lucide-react';
import { useWindowContext } from '../Contexts/windowContext';

interface fileExplorerProps extends WindowProps {
  title: string;
  images: { id: string; src: string; name: string }[];
  image?: { id: string; src: string; name: string }; // ← ici
}

export default function FileExplorer({ title, images, isVisible, onOpenViewer }: fileExplorerProps) {

  const columns = 6;
  const { openWindow, closeWindow, setViewerImage, setImages} = useWindowContext();
  const icons = images.reduce<{ key: string; value: IIcon }[]>((acc, item, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    acc.push({
      key: item.id,
      value: {
        id: item.id,
        title: item.name,
        src: item.src,
        row,
        col,
        onDoubleClick: () => {
          setViewerImage({
            id: item.id,
            src: item.src,
            name: item.name,
          });
          setImages(images);
          openWindow(`visionneuse`);
        },
      },
    });

    return acc;
  }, []);
  const windowId = `galeries`;
  const windowRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const updateRect = () => {
    if (windowRef.current) {
      setContainerRect(windowRef.current.getBoundingClientRect());
    }
  };
  if (!isVisible) return null;

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, top: 0, right: 800, bottom: 600 }}
      onDrag={updateRect}
      onDragEnd={updateRect}
      className="absolute top-20 left-20 w-[500px] z-50 h-[400px] bg-gray-800 rounded-md shadow-lg p-3 flex flex-col"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-white">{title}</div>
        <button
          onClick={() => closeWindow(windowId)}
          className="text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>
      </div>
      <IconProvider initialIcons={icons} >
        <FileIconGrid containerRect={containerRect} />
      </IconProvider>

    </motion.div>
  );
}
