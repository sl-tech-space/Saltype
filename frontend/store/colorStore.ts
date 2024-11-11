import { useState } from "#app";

export const useColorStore = () => {
  const colorStore = useState("colorStore", () => ({
    textColor: "#ffffff",
    backgroundColor: "#141414",
    mainColor: "#0099ff",
    subColor: "#0044fe",
    hoverColor: "#6f42c1",
  }));

  const setColor = (colorName: string, value: string) => {
    if (colorName in colorStore.value) {
      colorStore.value[colorName as keyof typeof colorStore.value] = value;
      if (import.meta.client) {
        localStorage.setItem(colorName, value);
      }
    }
  };

  const loadColors = () => {
    if (import.meta.client) {
      Object.keys(colorStore.value).forEach((colorName) => {
        const savedColor = localStorage.getItem(colorName);
        if (savedColor) {
          colorStore.value[colorName as keyof typeof colorStore.value] =
            savedColor;
        }
      });
    }
  };

  return {
    colorStore,
    setColor,
    loadColors,
  };
};
