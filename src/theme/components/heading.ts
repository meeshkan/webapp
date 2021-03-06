import { ComponentTheme } from "@chakra-ui/theme-tools";

const Heading: ComponentTheme = {
  defaultProps: {
    size: "xl",
  },
  baseStyle: {
    fontFamily: "heading",
    lineHeight: "1.2",
    fontWeight: 900,
  },
  sizes: {
    "2xl": { fontSize: ["4xl", null, "5xl"] },
    xl: { fontSize: ["3xl", null, "4xl"] },
    lg: { fontSize: ["xl", null, "2xl"] },
    md: { fontSize: "xl" },
    sm: { fontSize: "md" },
    xs: { fontSize: "sm" },
  },
};

export const HeadingSizes = {
  "2xl": "2xl",
  xl: "xl",
  lg: "lg",
  md: "md",
  sm: "sm",
  xs: "xs",
};

export default Heading;
