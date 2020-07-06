import { mode, Styles } from "@chakra-ui/theme-tools";

const styles: Styles = {
  global: (props) => ({
    fontFamily: "body",
    color: mode("gray.700", "gray.200")(props),
    bg: mode("gray.50", "gray.800")(props),
    lineHeight: "base",
    "*::placeholder": {
      color: mode("gray.400", "whiteAlpha.400")(props),
    },
    "*, *::before, &::after": {
      borderColor: mode("gray.100", "gray.800")(props),
      wordWrap: "break-word",
    },
    fontFeatureSettings: `"pnum"`,
    fontVariantNumeric: "proportional-nums",
  }),
};

export default styles;
