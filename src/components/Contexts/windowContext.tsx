import React, { createContext, useContext, useState } from 'react';

interface WindowContextType {
  toggleWindow: (id: string) => void;
  isOpen: (id: string) => boolean;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  viewerImage: { id: string; src: string; name: string } | null;
  setViewerImage: (img: { id: string; src: string; name: string } | null) => void;
  Images:{ id: string; src: string; name: string }[] | [];
  setImages: (imgs: { id: string; src: string; name: string }[]) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  const [windows, setWindows] = useState<Record<string, boolean>>({});
  const [viewerImage, setViewerImage] = useState<{ id: string; src: string; name: string } | null>(null);
  const [Images, setImagesSlider] = useState<{ id: string; src: string; name: string }[] | []>([]);

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

  const setImages = (images : { id: string; src: string; name: string }[]) => {
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
