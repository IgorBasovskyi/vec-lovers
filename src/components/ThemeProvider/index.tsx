"use client";

import * as React from "react";
import { Attribute, ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute: Attribute | Attribute[];
  defaultTheme: string;
  enableSystem: boolean;
  disableTransitionOnChange: boolean;
}

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
