[FR](/README.md) | [ EN](/README_EN.md)

---

# 💻 webOS - Web Desktop & File Explorer

An interactive desktop built with React/Next.js featuring window management, icons, and an integrated file explorer.  
The goal is to recreate the experience of an operating system directly in the browser, with resizable windows, multi-folder navigation, and an image viewer.

(Strongly inspired by this project, which took four years to develop — it deserves recognition.)  
https://github.com/DustinBrett/daedalOS

---

## ✨ Current Features

- **Interactive Desktop**
  - Movable icons
  - Position saved in React state
- **File Explorer**
  - Navigate through a folder tree
  - Double-click on an image file → open in image viewer
  - Back navigation (`...` icon or arrow)
- **Image Viewer**
  - Gallery of image files from the current folder
- **Window Management**
  - Open / close dynamically
  - Free positioning

---

## 🛠️ Technologies Used

- **React** + Hooks
- **TypeScript**
- **Framer Motion** (animations)
- **Lucide React** (SVG icons)
- **Tailwind CSS** (styling)
- **Context API** (shared state management)

---

## 📦 Installation

```bash
# Clone the project
git clone https://github.com/your-username/your-repo.git

# Go to the folder
cd your-repo

# Install dependencies
npm install

# Run the project
npm run dev
```

## 🗺️ Roadmap
# 📌 Phase 1 – Desktop & Explorer (in progress)

- Desktop icon management ✔️
- Folder navigation / back navigation ✔️
- Image viewer ✔️
- App context
- Background wallpapers
- Settings management
- Actual position saving (localStorage or backend)
- Improved drag & drop

# 📌 Phase 2 – User Experience

- Right-click menu (context menu)
- Rename file/folder
- Create new folders
- Move files between folders

# 📌 Phase 3 – Advanced Features

- Authentication system
- Persistent file storage (backend or API)
- Theme support (light/dark, customizable)
- Multi-window with stacking / resizing