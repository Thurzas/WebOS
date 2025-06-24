import React, { createContext, useContext, useState } from 'react';
import { IIcon, IconDictionary } from '@/utils/IconDictionary';

interface IconContextProps {
  iconDict: IconDictionary;
  setIconDict: React.Dispatch<React.SetStateAction<IconDictionary>>;

  addIcon: (icon: IIcon) => void;
  removeIcon: (id: string) => void;
  moveIcon: (id: string, newRow: number, newCol: number) => void;
}

const IconContext = createContext<IconContextProps | undefined>(undefined);

export const IconProvider = ({ children, initialIcons = [] }: { children: React.ReactNode, initialIcons?: { key: string; value: IIcon }[] }) => {
  const [iconDict, setIconDict] = useState(new IconDictionary(initialIcons));
  const addIcon = (icon: IIcon) => {
    setIconDict(prev => {
      const newDict = new IconDictionary(prev.keys().map(key => ({ key, value: prev[key] })));
      newDict.add(icon.id, icon);
      return newDict;
    });
  };

  const removeIcon = (id: string) => {
    setIconDict(prev => {
      const newDict = new IconDictionary(prev.keys().map(key => ({ key, value: prev[key] })));
      newDict.remove(id);
      return newDict;
    });
  };

  const moveIcon = (id: string, newRow: number, newCol: number) => {
    setIconDict(prev => {
      const updated = new IconDictionary(prev.keys().map(key => ({ key, value: prev[key] })));
      const icon = updated[id];
      if (!icon) return updated;
      updated.add(id, { ...icon, row: newRow, col: newCol });
      return updated;
    });
  };

  return (
    <IconContext.Provider value={{ iconDict, setIconDict, addIcon, removeIcon, moveIcon }}>
      {children}
    </IconContext.Provider>
  );
};

export const useIconContext = () => {
  const context = useContext(IconContext);
  if (!context) throw new Error('useIconContext must be used within IconProvider');
  return context;
};
