export interface WindowProps {
  title: string;
  isVisible: boolean;
  onOpenViewer?: (img: { id: string; src: string; name: string }) => void;
}