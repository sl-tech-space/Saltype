import { useState } from "#app";

export const useColorStore = () =>
  useState("colorStore", () => ({
    textColor: "#ffffff",
    backgroundColor: "#141414",
    mainColor: "#0099ff",
    subColor: "#0044fe",
    hoverColor: "#6f42c1",
  }));

export const setColor = (colorName: string, value: string) => {
  const colorStore = useColorStore();
  if (colorName in colorStore.value) {
    colorStore.value[colorName as keyof typeof colorStore.value] = value;
    if (import.meta.client) {
      localStorage.setItem(colorName, value);
    }
  }
};

export const loadColors = () => {
  if (import.meta.client) {
    const colorStore = useColorStore();
    Object.keys(colorStore.value).forEach((colorName) => {
      const savedColor = localStorage.getItem(colorName);
      if (savedColor) {
        colorStore.value[colorName as keyof typeof colorStore.value] =
          savedColor;
      }
    });
  }
};
