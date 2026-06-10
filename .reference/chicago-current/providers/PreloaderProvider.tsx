"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

interface PreloaderContextType {
  isLoading: boolean;
}

const PreloaderContext = createContext<PreloaderContextType>({
  isLoading: true,
});

export function usePreloader() {
  return useContext(PreloaderContext);
}

const MIN_DISPLAY_TIME = 2000;

export default function PreloaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Wait for both fonts and hero image before revealing
    const fontsReady = document.fonts.ready;
    const heroReady = new Promise<void>((resolve) => {
      const img = new Image();
      img.src = "/images/hero.jpg";
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't block on error
      }
    });

    Promise.all([fontsReady, heroReady]).then(() => {
      setContentReady(true);
    });
  }, []);

  useEffect(() => {
    if (contentReady && minTimeElapsed) {
      setIsLoading(false);
    }
  }, [contentReady, minTimeElapsed]);

  return (
    <PreloaderContext.Provider value={{ isLoading }}>
      {children}
    </PreloaderContext.Provider>
  );
}
