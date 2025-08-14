import { FileItem } from '@/utils/FileSystem';
import React, { createContext, useContext, useState } from 'react';

interface WindowContextType {
  toggleWindow: (id: string) => void;
  isOpen: (id: string) => boolean;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  viewerImage: FileItem | null;
  setViewerImage: (img: FileItem | null) => void;
  Images:FileItem[] | [];
  setImages: (imgs: FileItem[]) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  const [windows, setWindows] = useState<Record<string, boolean>>({});
  const [viewerImage, setViewerImage] = useState< FileItem | null>(null);
  const [Images, setImagesSlider] = useState<FileItem[] | []>([]);

  const openWindow = (id: string) => {
    setWindows(prev => ({ ...prev, [id]: true }));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => ({ ...prev, [id]: false }));
  };

  const toggleWindow = (id: string) => {
    setWindows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isOpen = (id: string) => {
    return !!windows[id];
  };

  const setImages = (images : FileItem[]) => {
    setImagesSlider(prev => images);
  };

  return (
    <WindowContext.Provider value={{
      toggleWindow,
      isOpen,
      openWindow,
      closeWindow,
      viewerImage,
      setViewerImage,
      Images,
      setImages,
    }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error('useWindowContext must be used within a WindowProvider');
  return context;
};
