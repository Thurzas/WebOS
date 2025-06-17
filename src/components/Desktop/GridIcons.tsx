import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Home, User, Bell, Search, Heart, Star, Folder, FileText } from 'lucide-react';
import { IconDictionary, IIcon } from '@/utils/IconDictionary';
import DesktopIcon from './Icon';

// Composant Gizmo de positionnement
interface GizmoProps {
    x: number;
    y: number;
    gridSize: number;
    show: boolean;
}

function PositionGizmo({ x, y, gridSize, show }: GizmoProps) {
    if (!show) return null;

    // Calculer la position de la grille la plus proche
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

interface GridIconsProps{
    initialIcons : { key: string; value: IIcon; }[];
}
// Composant principal Desktop Grid
const DesktopIconGrid = ({ initialIcons }: GridIconsProps) => {
    const [iconDict, setIconDict] = useState<IconDictionary | null>(null);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number; show: boolean }>({
        x: 0,
        y: 0,
        show: false
    });
    
    const [selectedIcon, setSelectedIcon] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerBounds, setContainerBounds] = useState<DOMRect | null>(null);

    const gridSize = 80; // Taille de chaque cellule de la grille
    const iconSize = 64; // Taille des icônes
    const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number } | null>(null);

    useLayoutEffect(() => {
    if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        setContainerBounds(bounds);
        console.log("Container bounds set via useLayoutEffect:", bounds);
    } else {
        console.warn("containerRef is null in useLayoutEffect");
    }
}, [windowDimensions]); // Dès que windowDimensions est prêt, on lit le container
    useEffect(() => {
        const dict = new IconDictionary(initialIcons);
        setIconDict(dict);

        // Set initial window dimensions on client-side
        if (typeof window !== 'undefined') {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    }, []); // Empty dependency array means this runs once after initial render on client

    // Add a resize listener for dynamic grid resizing
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') { // Sécurité supplémentaire
                setWindowDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
            // Update container bounds on resize
            if (containerRef.current) {
                setContainerBounds(containerRef.current.getBoundingClientRect());
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    // Gestionnaire de fin de drag
    const handleIconDragEnd = (iconId: string, newRow: number, newCol: number) => {
        if (!iconDict) return;

        // Vérifier s'il y a déjà une icône à cette position
        const existingIcon = iconDict.values().find(icon => 
            icon.id !== iconId && icon.row === newRow && icon.col === newCol
        );

        if (existingIcon) {
            // Échanger les positions
            const currentIcon = iconDict[iconId];
            const updatedCurrentIcon = { ...currentIcon, row: newRow, col: newCol };
            const updatedExistingIcon = { ...existingIcon, row: currentIcon.row, col: currentIcon.col };
            
            iconDict.add(iconId, updatedCurrentIcon);
            iconDict.add(existingIcon.id, updatedExistingIcon);
        } else {
            // Déplacer simplement l'icône
            const currentIcon = iconDict[iconId];
            const updatedIcon = { ...currentIcon, row: newRow, col: newCol };
            iconDict.add(iconId, updatedIcon);
        }

        // Mettre à jour l'état
        setIconDict(new IconDictionary(iconDict.keys().map(key => ({ key, value: iconDict[key] }))));
        
        // Cacher le gizmo
        setDragPosition(prev => ({ ...prev, show: false }));
    };

    // Ajouter une nouvelle icône
    const addNewIcon = () => {
        if (!iconDict) return;

        const availableComponents = [Search, Heart, Star, Bell, Plus];
        const colors = ['text-red-400', 'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-orange-400'];
        
        // Trouver une position libre
        let row = 0, col = 0;
        while (iconDict.values().some(icon => icon.row === row && icon.col === col)) {
            col++;
            if (col > 5) {
                col = 0;
                row++;
            }
        }

        const newIconId = `icon_${Date.now()}`;
        const newIcon: IIcon = {
            id: newIconId,
            title: `Icon ${iconDict.keys().length + 1}`,
            row,
            col,
            component: availableComponents[Math.floor(Math.random() * availableComponents.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            onDoubleClick: function (): void {
                throw new Error('Function not implemented.');
            }
        };

        iconDict.add(newIconId, newIcon);
        setIconDict(new IconDictionary(iconDict.keys().map(key => ({ key, value: iconDict[key] }))));
    };

    // Supprimer une icône
    const removeIcon = (iconId: string) => {
        if (!iconDict) return;
        
        iconDict.remove(iconId);
        setIconDict(new IconDictionary(iconDict.keys().map(key => ({ key, value: iconDict[key] }))));
        
        if (selectedIcon === iconId) {
            setSelectedIcon('');
        }
    };

    if (!iconDict || !windowDimensions) {
        return <div className="p-4">Chargement...</div>;
    }
    
    return (
        <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
            {/* Grille de fond (optionnelle, pour visualisation) */}
            <div className="absolute inset-0 opacity-10">
                {Array.from({ length: Math.ceil(window.innerHeight / gridSize) }).map((_, row) =>
                    Array.from({ length: Math.ceil(window.innerWidth / gridSize) }).map((_, col) => (
                        <div
                            key={`${row}-${col}`}
                            style={{
                                position: 'absolute',
                                left: col * gridSize,
                                top: row * gridSize,
                                width: gridSize,
                                height: gridSize,
                            }}
                            className="border border-white border-opacity-20"
                        />
                    ))
                )}
            </div>

            {/* Container principal pour les icônes */}
            <div ref={containerRef} className="relative w-full h-full">
                {/* Icônes */}
                {iconDict.values().map((icon) => (
                    <DesktopIcon
                        key={icon.id}
                        {...icon}
                        onDragEnd={handleIconDragEnd}
                          onDrag={(id, x, y) => {
                            setDragPosition({ x, y, show: true });
                        }}
                        gridSize={gridSize}
                        iconSize={iconSize}        
                        containerRect={containerBounds}
                    />
                ))}

                {/* Gizmo de positionnement */}
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

export default DesktopIconGrid;