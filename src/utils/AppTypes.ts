// src/apps/AppTypes.ts
import { ComponentType, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export type AppId = string;

export interface AppMeta {
  id: AppId;
  title: string;
  icon?: LucideIcon;         // icône lucide-react optionnelle
  color?: string;            // classe tailwind optionnelle
  description?: string;
}

export interface AppDefinition<P = any> {
  meta: AppMeta;
  component: ComponentType<P>;
  // props par défaut à injecter lors de l'ouverture
  defaultProps?: Partial<P>;
}

export interface AppOpenOptions<P = any> {
  props?: Partial<P>;
  titleOverride?: string;    // changer le titre de la fenêtre si besoin
}

export interface AppInstance<P = any> {
  instanceId: string;        // unique
  appId: AppId;
  title: string;
  props: P;
}
