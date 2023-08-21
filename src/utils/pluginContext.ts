import * as React from "react";
import JournalingPlugin from "../main";

export const PluginContext = React.createContext<JournalingPlugin>(undefined);

export function usePlugin(): JournalingPlugin {
  return React.useContext(PluginContext);
}
