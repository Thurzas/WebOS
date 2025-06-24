import Taskbar from './Taskbar';
import Background from './Background';
import GridIcons from './TestGridIcons';
import { FileText, Folder, Home, Image, Settings, User } from 'lucide-react';
import DesktopIconGrid from './GridIcons';
import FileExplorer from '../Apps/FileExplorer';
import { useState } from 'react';
import { IIcon } from '@/utils/IconDictionary';
import { useWindowContext, WindowProvider } from '../Contexts/windowContext';
import ImageViewer from '../Apps/ImageViewer';



export default function Desktop() {
  return (
    <WindowProvider>
      <DesktopContent />
    </WindowProvider>
  );
}

 function DesktopContent() {
  const imageList = [
    { id: '1', src: '/images/photo1.jpg', name: 'mlp.jpg' },
    { id: '2', src: '/images/photo2.jpg', name: 'etiquetteChampagne.jpg' },
    { id: '3', src: '/images/photo3.jpg', name: 'DnD.jpg' },
    { id: '4', src: '/images/photo4.jpg', name: 'Misty.jpg' },
    // Ajoute autant que tu veux
  ];
  
  const icons: { key: string; value: IIcon }[] = [
  {
    key: 'home',
    value: {
      id: 'home',
      title: 'Home',
      row: 0,
      col: 0,
      component: Home,
      color: 'text-blue-400',
      onDoubleClick: () => { console.log("home ?"); }
    }
  },
  {
    key: 'settings',
    value: {
      id: 'settings',
      title: 'Settings',
      row: 1,
      col: 0,
      component: Settings,
      color: 'text-gray-400',
      onDoubleClick: () => { console.log("Settings ?"); }
    }
  },
  {
    key: 'documents',
    value: {
      id: 'documents',
      title: 'Documents',
      row: 2,
      col: 0,
      component: Folder,
      color: 'text-yellow-400',
      onDoubleClick: () => { console.log("Files ?"); }
    }
  },
  {
    key: 'galeries',
    value: {
      id: 'galeries',
      title: 'Galeries',
      row: 3,
      col: 0,
      component: Image,
      color: 'text-purple-400',
      onDoubleClick: () => { 
        if(!isOpen('galeries'))
          openWindow('galeries');
      }
    }
  },
  // autres icônes...
  ];
  const { isOpen, toggleWindow, openWindow, viewerImage, setViewerImage} = useWindowContext();
  if(viewerImage)
    console.info("img:",viewerImage);
  return (
    <div className="relative bg-gray-900 text-white">
      <Background />
      <DesktopIconGrid initialIcons={icons} />
      <Taskbar />
      <FileExplorer
        title="galeries"
        images={imageList}
        isVisible={isOpen('galeries')}
        onOpenViewer={(image) => {
          setViewerImage(image);
          openWindow(`viewer-${image.id}`);
        } }
    />
    {viewerImage && (
      <ImageViewer
          title="Visionneuse"
          image={viewerImage} isVisible={false}      />
    )}
    </div>
  );
}


