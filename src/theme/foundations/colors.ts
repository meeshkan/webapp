export interface ColorHues {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export type Colors = typeof colors;

const colors = {
  transparent: "transparent",
  current: "currentColor",
  black: "#000",
  white: "#fff",

  whiteAlpha: {
    50: "rgba(255, 255, 255, 0.04)",
    100: "rgba(255, 255, 255, 0.06)",
    200: "rgba(255, 255, 255, 0.08)",
    300: "rgba(255, 255, 255, 0.16)",
    400: "rgba(255, 255, 255, 0.24)",
    500: "rgba(255, 255, 255, 0.36)",
    600: "rgba(255, 255, 255, 0.48)",
    700: "rgba(255, 255, 255, 0.64)",
    800: "rgba(255, 255, 255, 0.80)",
    900: "rgba(255, 255, 255, 0.92)",
  },

  blackAlpha: {
    50: "rgba(0, 0, 0, 0.04)",
    100: "rgba(0, 0, 0, 0.06)",
    200: "rgba(0, 0, 0, 0.08)",
    300: "rgba(0, 0, 0, 0.16)",
    400: "rgba(0, 0, 0, 0.24)",
    500: "rgba(0, 0, 0, 0.36)",
    600: "rgba(0, 0, 0, 0.48)",
    700: "rgba(0, 0, 0, 0.64)",
    800: "rgba(0, 0, 0, 0.80)",
    900: "rgba(0, 0, 0, 0.92)",
  },

  gray: {
    50: "#F5F7FA",
    100: "#E4E7EB",
    200: "#CBD2D9",
    300: "#9AA5B1",
    400: "#7B8794",
    500: "#616E7C",
    600: "#3E4C59",
    700: "#323F4B",
    800: "#1F2933",
    900: "#131A20",
  },

  red: {
    50: "#FCE8EE",
    100: "#FAD3DF",
    200: "#F5A3BC",
    300: "#F0759A",
    400: "#EB4778",
    500: "#DC1853",
    600: "#B81445",
    700: "#A1123D",
    800: "#8A0F34",
    900: "#5C0A23",
  },

  orange: {
    50: "#FFFAF0",
    100: "#FEEBC8",
    200: "#FBD38D",
    300: "#F6AD55",
    400: "#ED8936",
    500: "#DD6B20",
    600: "#C05621",
    700: "#9C4221",
    800: "#7B341E",
    900: "#652B19",
  },

  yellow: {
    50: "#FFFAEB",
    100: "#FEF3CC",
    200: "#FEE899",
    300: "#FDDD68",
    400: "#FDD235",
    500: "#FDC702",
    600: "#CA9F02",
    700: "#B08A02",
    800: "#977702",
    900: "#654F01",
  },

  green: {
    50: "#f0fff4",
    100: "#c6f6d5",
    200: "#9ae6b4",
    300: "#68d391",
    400: "#48bb78",
    500: "#38a169",
    600: "#2f855a",
    700: "#276749",
    800: "#22543d",
    900: "#1C4532",
  },

  teal: {
    50: "#E6FFFA",
    100: "#B2F5EA",
    200: "#81E6D9",
    300: "#4FD1C5",
    400: "#38B2AC",
    500: "#319795",
    600: "#2C7A7B",
    700: "#285E61",
    800: "#234E52",
    900: "#1D4044",
  },

  blue: {
    50: "#E9EDFB",
    100: "#D4DBF7",
    200: "#A8B7F0",
    300: "#7D92E8",
    400: "#526EE0",
    500: "#264AD9",
    600: "#1F3BAD",
    700: "#1B3498",
    800: "#172C82",
    900: "#0F1E57",
  },

  cyan: {
    50: "#E9FBF8",
    100: "#D4F7F1",
    200: "#A8F0E1",
    300: "#7DE8D3",
    400: "#52E0C4",
    500: "#33CCAE",
    600: "#29A38B",
    700: "#248F79",
    800: "#1F7A68",
    900: "#145246",
  },

  purple: {
    50: "#faf5ff",
    100: "#e9d8fd",
    200: "#d6bcfa",
    300: "#b794f4",
    400: "#9f7aea",
    500: "#805ad5",
    600: "#6b46c1",
    700: "#553c9a",
    800: "#44337a",
    900: "#322659",
  },

  pink: {
    50: "#fff5f7",
    100: "#fed7e2",
    200: "#fbb6ce",
    300: "#f687b3",
    400: "#ed64a6",
    500: "#d53f8c",
    600: "#b83280",
    700: "#97266d",
    800: "#702459",
    900: "#521B41",
  },

  mode: {
    light: {
      background: "#F5F7FA", // gray.50
      card: "#FFFFFF", // white
      title: "#1F2933", // gray.900
      titleHover: "#DC1853", // red.500
      text: "#3E4C59", // gray.700
      tertiary: "#616E7C", // gray.500
      icon: "#E4E7EB", // gray.100
      link: "#264AD9", // blue.500
    },
    dark: {
      background: "#323F4B", // gray.800
      card: "#1F2933", // gray.900
      title: "#FFFFFF", // white
      titleHover: "#F0759A", // red.300
      text: "#CBD2D9", // gray.200
      tertiary: "#7B8794", // gray.400
      icon: "#323F4B", // gray.800
      link: "#7D92E8", // blue.300
    },
  },
};

export default colors;
