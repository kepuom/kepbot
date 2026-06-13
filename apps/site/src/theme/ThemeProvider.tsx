"use client";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type FC,
  type PropsWithChildren,
} from "react";

type Theme<T = "light" | "dark"> = {
  theme: T;
  setTheme: Dispatch<SetStateAction<T>>;
};

const ThemeContext = createContext<Theme>({} as Theme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className={theme}>
      <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
    </div>
  );
};
