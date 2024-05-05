"use client";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./ThemeProvider";

export default function RecoilProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </RecoilRoot>
  );
}
