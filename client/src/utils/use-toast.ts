"use client";

import { toast as sonnerToast } from "sonner";

// Configuraciones por defecto
const defaultConfig = {
  duration: 4000,
  position: "bottom-right" as const,
  closeButton: true,
};

// Wrapper con configuraciones por defecto
export const toast = {
  success: (title: string, description?: string) => {
    return sonnerToast.success(title, {
      description,
      ...defaultConfig,
    });
  },

  error: (title: string, description?: string) => {
    return sonnerToast.error(title, {
      description,
      ...defaultConfig,
      duration: 6000, // Errores duran más tiempo
    });
  },

  info: (title: string, description?: string) => {
    return sonnerToast.info(title, {
      description,
      ...defaultConfig,
    });
  },

  warning: (title: string, description?: string) => {
    return sonnerToast.warning(title, {
      description,
      ...defaultConfig,
    });
  },

  loading: (title: string, description?: string) => {
    return sonnerToast.loading(title, {
      description,
      ...defaultConfig,
    });
  },

  // Para casos especiales donde necesites más control
  custom: (title: string, options?: any) => {
    return sonnerToast(title, {
      ...defaultConfig,
      ...options,
    });
  },

  // Métodos de control
  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),

  // Promesas - útil para operaciones async
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      ...defaultConfig,
    });
  },
};
