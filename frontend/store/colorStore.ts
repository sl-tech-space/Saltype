import { useState } from "#app";

export const useColorStore = () => {
  const defaultColors = {
    textColor: "#ffffff",
    backgroundColor: "#141414",
    mainColor: "#0099ff",
    subColor: "#0044fe",
    hoverColor: "#6f42c1",
  };

  const colorStore = useState("colorStore", () => ({ ...defaultColors }));

  const setColor = (colorName: string, value: string) => {
    if (colorName in colorStore.value) {
      colorStore.value[colorName as keyof typeof colorStore.value] = value;
      if (process.client) {
        localStorage.setItem(colorName, value);
      }
    }
  };

  const loadColors = () => {
    if (process.client) {
      Object.keys(colorStore.value).forEach((colorName) => {
        const savedColor = localStorage.getItem(colorName);
        if (savedColor) {
          colorStore.value[colorName as keyof typeof colorStore.value] =
            savedColor;
        }
      });
    }
  };

  const resetColors = () => {
    Object.keys(defaultColors).forEach((colorName) => {
      colorStore.value[colorName as keyof typeof colorStore.value] =
        defaultColors[colorName as keyof typeof defaultColors];
      if (process.client) {
        localStorage.removeItem(colorName);
      }
    });
  };

  return {
    colorStore,
    setColor,
    loadColors,
    resetColors,
  };
};
