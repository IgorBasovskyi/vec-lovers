import { useTheme } from "next-themes";

type ThemeOptions<T> = {
  light: T;
  dark: T;
};

export const useThemeMode = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const isLight = currentTheme === "light";

  const pick = <T>(options: ThemeOptions<T>): T =>
    isDark ? options.dark : options.light;

  return { theme: currentTheme, isDark, isLight, pick };
};
