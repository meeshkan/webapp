import { ComponentTheme, Props, mode } from "@chakra-ui/theme-tools";

const Link: ComponentTheme<Props> = {
  baseStyle: (props) => ({
    transition: `all 0.15s ease-out`,
    cursor: "pointer",
    textDecoration: "none",
    outline: "none",
    color: mode("blue.500", "blue.200")(props),
    _hover: {
      textDecoration: "underline",
    },
    _focus: {
      boxShadow: "outline",
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
      textDecoration: "none",
    },
  }),
};

export default Link;
