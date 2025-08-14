export interface FileEntry {
  id: string;
  name: string;
  type: "file" | "folder";
  mime?: string;
  children?: FileEntry[];
}

export const mockFileSystem: FileEntry[] = [
  {
    id: "1",
    name: "Images",
    type: "folder",
    children: [
      { id: "1-1", name: "chat.jpg", type: "file", mime: "image/jpeg" },
      { id: "1-2", name: "plage.png", type: "file", mime: "image/png" }
    ]
  },
  {
    id: "2",
    name: "Documents",
    type: "folder",
    children: [
      { id: "2-1", name: "notes.txt", type: "file", mime: "text/plain" }
    ]
  }
];

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  src?: string; // pour fichiers images
  children?: FileItem[]; // si folder
}
