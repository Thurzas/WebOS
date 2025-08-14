import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder as FolderIcon, X } from 'lucide-react';
import { useWindowContext } from '../Contexts/windowContext';
import { IconProvider, useIconContext } from '../Contexts/IconContext';
import FileIconGrid from '../Desktop/FileIconGrid';
import { WindowProps } from '@/utils/Window';
import { FileItem } from '@/utils/FileSystem';
import { IconDictionary, IIcon } from '@/utils/IconDictionary';

interface FileExplorerProps extends WindowProps {
  title: string;
  root: FileItem[];
}

/** ---- Helpers ---- */
const GRID_COLUMNS = 6;

function itemsToIcons(
  items: FileItem[],
  onOpenFolder: (folder: FileItem) => void,
  onOpenFile: (file: FileItem, allFilesInView: FileItem[]) => void,
  onGoBack?: () => void
): { key: string; value: IIcon }[] {
  return items.map((item, index) => {
    const row = Math.floor(index / GRID_COLUMNS);
    const col = index % GRID_COLUMNS;

    const base: IIcon = {
      id: item.id,
      title: item.name,
      row,
      col,
      onDoubleClick: () => {
        if (item.id === '__go_back__') {
          onGoBack?.();
        } else if (item.type === 'folder') {
          onOpenFolder(item);
        } else {
          onOpenFile(item, items.filter(i => i.type === 'file'));
        }
      },
    };

    if (item.id === '__go_back__') {
      return { key: item.id, value: { ...base, component: FolderIcon, color: 'text-gray-400',draggable:false } };
    } else if (item.type === 'file' && item.src) {
      return { key: item.id, value: { ...base, src: item.src } };
    } else if (item.type === 'folder') {
      return { key: item.id, value: { ...base, component: FolderIcon, color: 'text-yellow-400' } };
    } else {
      return { key: item.id, value: base };
    }
  });
}


/** ---- Corps interne qui consomme le contexte ---- */
function ExplorerBody({ title, root }: { title: string; root: FileItem[] }) {
  const { openWindow, closeWindow, setViewerImage, setImages } = useWindowContext();
  const { setIconDict } = useIconContext();

  // pile de navigation
  const [pathStack, setPathStack] = useState<FileItem[][]>([root]);
  const currentItems = useMemo(() => {
    if (pathStack.length > 1) {
      // Faux item pour retour
      const backItem: FileItem = {
        id: '__go_back__',
        name: '...',
        type: 'folder',
      };
      return [backItem, ...pathStack[pathStack.length - 1]];
    }
    return pathStack[pathStack.length - 1];
  }, [pathStack]);


  const containerRef = useRef<HTMLDivElement>(null);

  const enterFolder = (folder: FileItem) => {
    if (folder.type === 'folder' && folder.children) {
      setPathStack(prev => [...prev, folder.children!]);
    }
  };

  const goBack = () => {
    if (pathStack.length > 1) {
      setPathStack(prev => prev.slice(0, -1));
    }
  };

  const openFile = (file: FileItem, filesInView: FileItem[]) => {
    // file est un FileItem (pas d’interface anonyme)
    setViewerImage(file);
    // on n’envoie au viewer que les fichiers visibles (pas les dossiers)
    setImages(filesInView);
    openWindow('Visionneuse');
  };

  // À chaque changement de dossier courant → pousser les icônes dans le contexte
  useEffect(() => {
    const entries = itemsToIcons(currentItems, enterFolder, openFile, goBack);
    setIconDict(new IconDictionary(entries));
  }, [currentItems, setIconDict]);

  return (
    <div className="flex-1 h-[300px] min-h-0">
      <FileIconGrid containerRect={null} />
    </div>
  );
}

/** ---- Composant exporté : instancie un IconProvider par fenêtre ---- */
export default function FileExplorer({ title, root, isVisible }: FileExplorerProps) {
  // icônes initiales = contenu de root au premier rendu
  const initialIcons = useMemo(
    () => itemsToIcons(root, () => {}, () => {}),
    [root]
  );

  if (!isVisible) return null;

  return (
    <div className="h-[300px]">
      {/* Un provider par fenêtre pour isoler l’état de la grille */}
      <IconProvider initialIcons={initialIcons}>
        <ExplorerBody title={title} root={root} />
      </IconProvider>
    </div>
  );
}
