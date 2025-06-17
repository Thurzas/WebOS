import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Home, Bell, Search, Heart, Star, Folder, FileText, User } from 'lucide-react';
import { IIcon } from '@/utils/IconDictionary';

// Interfaces et classes Dictionary (reprises du composant précédent)
interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}

interface IIconDictionary extends IDictionary {
    [key: string]: any;
    values(): IIcon[];
    toLookup(): IIconDictionary;
}

class Dictionary implements IDictionary {
    [key: string]: any;
    protected _keys: string[] = [];
    protected _values: any[] = [];
   
    constructor(init: { key: string; value: any; }[]) {
        for (let x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }
    
    add(key: string, value: any): void {
        if (!this.containsKey(key)) {
            this._keys.push(key);
            this._values.push(value);
        } else {
            const index = this._keys.indexOf(key);
            this._values[index] = value;
        }
        this[key] = value;
    }
    
    remove(key: string): void {
        const index = this._keys.indexOf(key);
        if (index !== -1) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
            delete this[key];
        }
    }
    
    keys(): string[] {
        return [...this._keys];
    }
    
    values(): any[] {
        return [...this._values];
    }
    
    containsKey(key: string): boolean {
        return typeof this[key] !== "undefined";
    }
    
    toLookup(): IDictionary {
        return this;
    }
}

class IconDictionary extends Dictionary implements IIconDictionary {
    constructor(init: { key: string; value: IIcon; }[]) {
        super(init);
    }
    
    add(key: string, value: IIcon): void {
        super.add(key, value);
    }
    
    values(): IIcon[] {
        return this._values as IIcon[];
    }
    
    toLookup(): IIconDictionary {
        return this;
    }
}

// Composant Icon individuel
interface IconProps extends IIcon {
    onDragEnd: (iconId: string, newRow: number, newCol: number) => void;
    gridSize: number;
    iconSize: number;
    onDrag: (iconId: string, x: number, y: number) => void;
    // ADD THIS PROP:
    containerRect: DOMRect | null; // Pass the bounding rect of the drag container
}

// Dans DesktopIcon

function DesktopIcon({ id, title, row, col, component: IconComponent, color, onDragEnd, gridSize, iconSize, onDrag, containerRect }: IconProps) {
    const offsetX = (gridSize - iconSize) / 2;
    const offsetY = (gridSize - iconSize) / 2;

    const targetX = col * gridSize + offsetX;
    const targetY = row * gridSize + offsetY;

    const handleDrag = (event: any, info: any) => {
        if (!containerRect) {
            console.warn("Container Rect not available during drag.");
            return;
        }

        const currentX = info.point.x - containerRect.left - iconSize / 2;
        const currentY = info.point.y - containerRect.top - iconSize / 2;
        onDrag(id, currentX, currentY);
    };

    const handleDragEnd = (event: any, info: any) => {
        // Use the passed containerRect instead of event.target.offsetParent
        if (!containerRect) {
            console.warn("Container Rect not available during drag end.");
            return;
        }

        const droppedX = info.point.x - containerRect.left;
        const droppedY = info.point.y - containerRect.top;
        
        const newCol = Math.max(0, Math.round((droppedX - iconSize / 2) / gridSize));
        const newRow = Math.max(0, Math.round((droppedY - iconSize / 2) / gridSize));
        
        onDragEnd(id, newRow, newCol);
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{
                width: iconSize,
                height: iconSize,
                x: targetX,
                y: targetY,
            }}
            className="absolute cursor-pointer select-none z-10 flex flex-col items-center justify-center"
            whileDrag={{ scale: 1.1, zIndex: 50 }}
            animate={{ x: targetX, y: targetY }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div
                style={{ width: iconSize, height: iconSize }}
                className="bg-gray-700 rounded-md flex items-center justify-center shadow-lg hover:bg-gray-600 transition-colors"
            >
                {IconComponent ? (
                    <IconComponent size={iconSize * 0.5} className={color || "text-white"} />
                ) : (
                    <span className="text-white text-xl">🗔</span>
                )}
            </div>
            <span className="text-xs text-center mt-1 text-white bg-black bg-opacity-50 px-1 rounded max-w-16 truncate">
                {title}
            </span>
        </motion.div>
    );
}
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

// Composant principal Desktop Grid
const DesktopIconGrid = () => {
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
    console.log("DesktopIconGrid Render: containerBounds =", containerBounds); // See its value on every render

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
        const initialIcons: { key: string; value: IIcon }[] = [
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
            row: 0,
            col: 0,
            component: Settings,
            color: 'text-blue-400',
            onDoubleClick: () => { console.log("Settings ?"); }
            }
        },
        {
            key: 'files',
            value: {
            id: 'files',
            title: 'Files',
            row: 0,
            col: 0,
            component: Folder,
            color: 'text-yellow-400',
            onDoubleClick: () => { console.log("Files ?"); }
            }
        },
        // autres icônes...
        ];

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
                console.log(newIcon.title);
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

            {/* Panneau de contrôle */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Desktop Icons</h3>
                <div className="space-y-2">
                    <button
                        onClick={addNewIcon}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors"
                    >
                        Ajouter icône
                    </button>
                    <div className="text-xs">
                        Icônes: {iconDict.keys().length}
                    </div>
                    <div className="text-xs">
                        Grille: {gridSize}px
                    </div>
                </div>
            </div>

            {/* Liste des icônes (pour debug/gestion) */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-4 rounded-lg text-white max-w-xs">
                <h4 className="font-semibold mb-2">Positions des icônes:</h4>
                <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
                    {iconDict.values().map((icon) => (
                        <div key={icon.id} className="flex justify-between items-center">
                            <span>{icon.title}</span>
                            <span className="text-gray-300">({icon.row},{icon.col})</span>
                            <button
                                onClick={() => removeIcon(icon.id)}
                                className="text-red-400 hover:text-red-300 ml-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DesktopIconGrid;