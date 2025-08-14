import { IIcon } from "@/utils/IconDictionary";
import { motion } from "framer-motion";

interface IconProps extends IIcon {
    onDragEnd: (iconId: string, newRow: number, newCol: number) => void;
    gridSize: number;
    iconSize: number;
    onDrag: (iconId: string, x: number, y: number) => void;
    // ADD THIS PROP:
    containerRect: DOMRect | null; // Pass the bounding rect of the drag container
    onDoubleClick: () => void;
    src?: string;
    draggable?: boolean;
}

// Dans DesktopIcon

export default function DesktopIcon({ id, title, row, col, component: IconComponent, color, onDragEnd, gridSize, iconSize, onDrag, containerRect, onDoubleClick,src, draggable=true  }: IconProps) {
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
            drag={draggable}
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
            onDoubleClick={onDoubleClick}
        >
            <div
                style={{ width: iconSize, height: iconSize }}
                className="bg-gray-700 rounded-md flex items-center justify-center shadow-lg hover:bg-gray-600 transition-colors"
            >
                {src ? (
                <img
                    src={src}
                    alt={title}
                    draggable={false}
                    style={{ width: iconSize * 0.6, height: iconSize * 0.6 }}
                    className="object-contain rounded"
                />
                ) : IconComponent ? (
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