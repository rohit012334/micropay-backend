import { createContext, useContext } from "react";

const TooltipContext = createContext({});

export function TooltipProvider({ children }) {
  return <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>;
}

export function useTooltip() {
  return useContext(TooltipContext);
}
