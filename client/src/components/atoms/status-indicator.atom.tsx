"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@api/client";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";

export function StatusIndicator() {
  const [status, setStatus] = useState<
    "checking" | "online" | "offline" | "error"
  >("checking");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const checkApiStatus = async () => {
      setStatus("checking");
      try {
        await apiClient.get("/products", { timeout: 3000 });
        setStatus("online");
        setErrorMessage("");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(error.message || "Connection failed");

        // Después de 2 segundos, cambiar a offline mode
        setTimeout(() => {
          setStatus("offline");
        }, 2000);
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  if (status === "checking") return null;

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          icon: <Wifi className="h-3 w-3" />,
          text: "API Connected",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
      case "error":
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          text: "Connection Error",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
      case "offline":
      default:
        return {
          icon: <WifiOff className="h-3 w-3" />,
          text: "Offline Mode",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`fixed top-6 right-4 z-30 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
      {status === "error" && errorMessage && (
        <span className="ml-1 opacity-75 truncate max-w-32">
          ({errorMessage})
        </span>
      )}
    </div>
  );
}
