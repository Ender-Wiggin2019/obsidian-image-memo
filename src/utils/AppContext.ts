import * as React from "react";
import { App } from "obsidian";

export const AppContext = React.createContext<App>(undefined);

export function useApp(): App {
  return React.useContext(AppContext);
}
