// src/apps/AppContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AppDefinition, AppId, AppInstance, AppOpenOptions } from "@/utils/AppTypes";
import DesktopWindow from "../Desktop/Window";

interface AppContextType {
  registerApp: (app: AppDefinition) => void;
  openApp: <P = any>(appId: AppId, options?: AppOpenOptions<P>) => string; // retourne instanceId
  closeInstance: (instanceId: string) => void;
  listApps: () => AppDefinition[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppLoader = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppLoader must be used within <AppProvider>");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode; initialApps?: AppDefinition[] }> = ({
  children,
  initialApps = [],
}) => {
  const registryRef = useRef<Map<AppId, AppDefinition>>(new Map());
  // init registre
  if (registryRef.current.size === 0 && initialApps.length) {
    initialApps.forEach((a) => registryRef.current.set(a.meta.id, a));
  }

  const [instances, setInstances] = useState<AppInstance<any>[]>([]);

  const registerApp = useCallback((app: AppDefinition) => {
    registryRef.current.set(app.meta.id, app);
  }, []);

  const openApp = useCallback(<P,>(appId: AppId, options?: AppOpenOptions<P>): string => {
    const def = registryRef.current.get(appId);
    if (!def) throw new Error(`App "${appId}" not registered`);

    const instanceId = `app:${appId}:${Date.now()}`;
    const title = options?.titleOverride ?? def.meta.title;
    const props = { ...(def.defaultProps ?? {}), ...(options?.props ?? {}) } as P;

    setInstances((prev) => [...prev, { instanceId, appId, title, props }]);
    return instanceId;
  }, []);

  const closeInstance = useCallback((instanceId: string) => {
    setInstances((prev) => prev.filter((i) => i.instanceId !== instanceId));
  }, []);

  const listApps = useCallback(() => Array.from(registryRef.current.values()), []);

  const value = useMemo(() => ({ registerApp, openApp, closeInstance, listApps }), [
    registerApp,
    openApp,
    closeInstance,
    listApps,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}

      {/* Rendu des fenêtres d'app */}
      {instances.map((inst) => {
        const def = registryRef.current.get(inst.appId)!;
        const AppComponent = def.component as React.ComponentType<any>;
        return (
          <DesktopWindow
            key={inst.instanceId}
            windowId={inst.instanceId}
            title={inst.title}
            isVisible={true}
          >
            <AppComponent {...inst.props} />
          </DesktopWindow>
        );
      })}
    </AppContext.Provider>
  );
};
