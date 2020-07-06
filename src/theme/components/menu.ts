import { Props, mode, ComponentTheme, copy } from "@chakra-ui/theme-tools";
import { SystemProps } from "@chakra-ui/system";
import Button from "./button";

const getMenuListStyle = (props: Props): SystemProps => {
  return {
    bg: mode(`#fff`, `gray.700`)(props),
    boxShadow: mode(`sm`, `dark-lg`)(props),
    color: "inherit",
    outline: 0,
    minWidth: "3xs",
    paddingY: "2",
    zIndex: "1",
    borderRadius: "sm",
    border: "1px solid",
    borderColor: "inherit",
  };
};

const getMenuItemStyle = (props: Props): SystemProps => ({
  width: "100%",
  outline: 0,
  textDecoration: "none",
  paddingY: 2,
  paddingX: 3,
  transition: "background 50ms ease-in 0s",
  _focus: {
    bg: mode(`gray.50`, `gray.800`)(props),
  },
  _active: {
    bg: mode(`gray.50`, `gray.800`)(props),
  },
  _expanded: {
    bg: mode(`gray.50`, `gray.800`)(props),
  },
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
});

const Menu: ComponentTheme = {
  defaultProps: Button.defaultProps,
  baseStyle: (props) => ({
    MenuButton: {
      ...(Button.baseStyle as SystemProps),
      _hover: {
        bg: mode(`gray.100`, `gray.700`)(props),
      },
      _focus: {
        bg: mode(`gray.50`, `gray.800`)(props),
      },
      _active: {
        bg: mode(`gray.50`, `gray.800`)(props),
      },
      _expanded: {
        bg: mode(`gray.50`, `gray.800`)(props),
      },
    },
    MenuList: getMenuListStyle(props),
    MenuItem: getMenuItemStyle(props),
    MenuGroupTitle: {
      marginX: 4,
      marginY: 2,
      fontWeight: 400,
      fontSize: "sm",
    },
  }),
  variants: {
    /**
     * We're using `copy` function to copy all button variants
     * under the key `MenuButton`.
     *
     * You can ignore this copy and write your own variant styles
     * for the different sub-components.
     *
     * @example
     *
     * variants: {
     *   simple: {
     *     MenuButton: {...}
     *   },
     *   extended: {
     *      MenuButton: {...}
     *   }
     * }
     */
    ...copy(Button.variants, "MenuButton"),
  },
  sizes: {
    /**
     * We're using `copy` function to copy all button sizes
     * under the key `MenuButton`.
     */
    ...copy(Button.sizes, "MenuButton"),
  },
};

export default Menu;
