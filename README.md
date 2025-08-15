[FR](/README.md) | [ EN](/README_EN.md)

---

# 💻 webOS - Explorateur de Fichiers & Bureau Web

Un bureau interactif en React/Next.js avec gestion de fenêtres, icônes et explorateur de fichiers intégré.  
L’objectif est de recréer l’expérience d’un système d’exploitation directement dans le navigateur, avec des fenêtres modulables, un explorateur multi-dossiers et une visionneuse d’images.

(Forte inspiration de ce projet, il a mit quatre ans à développer ceci, cela mérite qu'on parle de lui.)
https://github.com/DustinBrett/daedalOS

---

## ✨ Fonctionnalités actuelles

- **Bureau interactif**
  - Icônes déplaçables
  - Sauvegarde de la position (dans l’état React)
- **Explorateur de fichiers**
  - Navigation dans un arbre de dossiers
  - Double-clic sur un fichier image → ouverture dans la visionneuse
  - Navigation arrière (icône `...` ou flèche)
- **Visionneuse d’images**
  - Galerie des fichiers images du dossier courant
- **Gestion des fenêtres**
  - Ouverture / fermeture dynamique
  - Positionnement libre

---

## 🛠️ Technologies utilisées

- **React** + Hooks
- **TypeScript**
- **Framer Motion** (animations)
- **Lucide React** (icônes SVG)
- **Tailwind CSS** (styles)
- **Context API** (gestion d’état partagé)

---

## 📦 Installation

```bash
# Cloner le projet
git clone https://github.com/ton-profil/ton-repo.git

# Aller dans le dossier
cd ton-repo

# Installer les dépendances
npm install

# Lancer le projet
npm run dev
```

---

# 🗺️ Roadmap

## 📌 Phase 1 – Bureau & Explorateur (en cours)
 - Gestion des icônes sur le bureau ✔️
 - Navigation dossier / retour arrière ✔️
 - Visionneuse d'images ✔️
 - animation arrière plan (wallpapers)
 - Gestionnaire des paramètres (Settings)
 - Sauvegarde réelle des positions (localStorage ou backend)
 - Amélioration du drag & drop
## 📌 Phase 2 – Expérience utilisateur
 - Gestion du clic droit (menu contextuel)
 - Renommer un fichier/dossier
 - Création de nouveaux dossiers
 - Déplacement de fichiers entre dossiers

## 📌 Phase 3 – Fonctionnalités avancées
 - Système d'authentification
 - Stockage persistant des fichiers (backend ou API)
 - Thème (clair/sombre, personnalisable)
 - Multi-fenêtre avec superposition / redimensionnement