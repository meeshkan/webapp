import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useId } from "@reach/auto-id";
import { createContext, forwardRef, useContext, useEffect, useRef, useState } from "react";
import Box from "../Box";
import PseudoBox from "../PseudoBox";
import Text from "../Text";
import { useColorMode } from "../ColorModeProvider";
import usePrevious from "../usePrevious";
import { getFocusables, useForkRef, wrapEvent } from "../utils";
import { useMenuItemStyle, useMenuListStyle } from "./styles";
import Divider from "../Divider";
import Popper from "../Popper";
var MenuContext = createContext();

var Menu = function Menu(_ref) {
  var children = _ref.children,
      isOpenProp = _ref.isOpen,
      defaultIsOpen = _ref.defaultIsOpen,
      onOpen = _ref.onOpen,
      onClose = _ref.onClose,
      _ref$autoSelect = _ref.autoSelect,
      autoSelect = _ref$autoSelect === void 0 ? true : _ref$autoSelect,
      _ref$closeOnBlur = _ref.closeOnBlur,
      closeOnBlur = _ref$closeOnBlur === void 0 ? true : _ref$closeOnBlur,
      _ref$closeOnSelect = _ref.closeOnSelect,
      closeOnSelect = _ref$closeOnSelect === void 0 ? true : _ref$closeOnSelect,
      defaultActiveIndex = _ref.defaultActiveIndex,
      placement = _ref.placement;

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var _useState = useState(defaultActiveIndex || -1),
      activeIndex = _useState[0],
      setActiveIndex = _useState[1];

  var _useState2 = useState(defaultIsOpen || false),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var _useRef = useRef(isOpenProp != null),
      isControlled = _useRef.current;

  var _isOpen = isControlled ? isOpenProp : isOpen;

  var menuId = "menu-" + useId();
  var buttonId = "menubutton-" + useId();
  var focusableItems = useRef(null);
  var menuRef = useRef(null);
  var buttonRef = useRef(null);
  useEffect(function () {
    if (_isOpen && menuRef && menuRef.current) {
      var focusables = getFocusables(menuRef.current).filter(function (node) {
        return ["menuitem", "menuitemradio", "menuitemcheckbox"].includes(node.getAttribute("role"));
      });
      focusableItems.current = menuRef.current ? focusables : [];
      initTabIndex();
    }
  }, [_isOpen]);

  var updateTabIndex = function updateTabIndex(index) {
    if (focusableItems.current.length > 0) {
      var nodeAtIndex = focusableItems.current[index];
      focusableItems.current.forEach(function (node) {
        if (node !== nodeAtIndex) {
          node.setAttribute("tabindex", -1);
        }
      });
      nodeAtIndex.setAttribute("tabindex", 0);
    }
  };

  var resetTabIndex = function resetTabIndex() {
    if (focusableItems.current) {
      focusableItems.current.forEach(function (node) {
        return node.setAttribute("tabindex", -1);
      });
    }
  };

  var initTabIndex = function initTabIndex() {
    focusableItems.current.forEach(function (node, index) {
      return index === 0 && node.setAttribute("tabindex", 0);
    });
  };

  var wasPreviouslyOpen = usePrevious(_isOpen);
  useEffect(function () {
    if (activeIndex !== -1) {
      focusableItems.current[activeIndex] && focusableItems.current[activeIndex].focus();
      updateTabIndex(activeIndex);
    }

    if (activeIndex === -1 && !_isOpen && wasPreviouslyOpen) {
      buttonRef.current && buttonRef.current.focus();
    }

    if (activeIndex === -1 && _isOpen) {
      menuRef.current && menuRef.current.focus();
    }
  }, [activeIndex, _isOpen, buttonRef, menuRef, wasPreviouslyOpen]);

  var focusOnFirstItem = function focusOnFirstItem() {
    openMenu();
    setActiveIndex(0);
  };

  var openMenu = function openMenu() {
    if (!isControlled) {
      setIsOpen(true);
    }

    if (onOpen) {
      onOpen();
    }
  };

  var focusAtIndex = function focusAtIndex(index) {
    setActiveIndex(index);
  };

  var focusOnLastItem = function focusOnLastItem() {
    openMenu();
    setActiveIndex(focusableItems.current.length - 1);
  };

  var closeMenu = function closeMenu() {
    if (!isControlled) {
      setIsOpen(false);
    }

    if (onClose) {
      onClose();
    }

    setActiveIndex(-1);
    resetTabIndex();
  };

  var context = {
    activeIndex: activeIndex,
    isOpen: _isOpen,
    focusAtIndex: focusAtIndex,
    focusOnLastItem: focusOnLastItem,
    focusOnFirstItem: focusOnFirstItem,
    closeMenu: closeMenu,
    buttonRef: buttonRef,
    menuRef: menuRef,
    focusableItems: focusableItems,
    placement: placement,
    menuId: menuId,
    buttonId: buttonId,
    openMenu: openMenu,
    autoSelect: autoSelect,
    closeOnSelect: closeOnSelect,
    closeOnBlur: closeOnBlur,
    colorMode: colorMode
  };
  return jsx(MenuContext.Provider, {
    value: context
  }, typeof children === "function" ? children({
    isOpen: _isOpen,
    onClose: closeMenu
  }) : children);
};

export function useMenuContext() {
  var context = useContext(MenuContext);

  if (context === undefined) {
    throw new Error("useMenuContext must be used within a MenuContext Provider");
  }

  return context;
} //////////////////////////////////////////////////////////////////////////////////////////

var PseudoButton = forwardRef(function (props, ref) {
  return jsx(PseudoBox, _extends({
    ref: ref,
    as: "button"
  }, props));
});
PseudoButton.displayName = "PseudoButton";
var MenuButton = forwardRef(function (_ref2, ref) {
  var onClick = _ref2.onClick,
      onKeyDown = _ref2.onKeyDown,
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? PseudoButton : _ref2$as,
      rest = _objectWithoutPropertiesLoose(_ref2, ["onClick", "onKeyDown", "as"]);

  var _useMenuContext = useMenuContext(),
      isOpen = _useMenuContext.isOpen,
      focusOnLastItem = _useMenuContext.focusOnLastItem,
      focusOnFirstItem = _useMenuContext.focusOnFirstItem,
      closeMenu = _useMenuContext.closeMenu,
      menuId = _useMenuContext.menuId,
      buttonId = _useMenuContext.buttonId,
      autoSelect = _useMenuContext.autoSelect,
      openMenu = _useMenuContext.openMenu,
      buttonRef = _useMenuContext.buttonRef;

  var menuButtonRef = useForkRef(buttonRef, ref);
  return jsx(Comp, _extends({
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
    "aria-controls": menuId,
    id: buttonId,
    role: "button",
    ref: menuButtonRef,
    onClick: wrapEvent(onClick, function () {
      if (isOpen) {
        closeMenu();
      } else {
        if (autoSelect) {
          focusOnFirstItem();
        } else {
          openMenu();
        }
      }
    }),
    onKeyDown: wrapEvent(onKeyDown, function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusOnFirstItem();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusOnLastItem();
      }
    })
  }, rest));
});
MenuButton.displayName = "MenuButton"; //////////////////////////////////////////////////////////////////////////////////////////

var MenuList = function MenuList(_ref3) {
  var onKeyDown = _ref3.onKeyDown,
      onBlur = _ref3.onBlur,
      props = _objectWithoutPropertiesLoose(_ref3, ["onKeyDown", "onBlur"]);

  var _useMenuContext2 = useMenuContext(),
      index = _useMenuContext2.activeIndex,
      isOpen = _useMenuContext2.isOpen,
      focusAtIndex = _useMenuContext2.focusAtIndex,
      focusOnFirstItem = _useMenuContext2.focusOnFirstItem,
      focusOnLastItem = _useMenuContext2.focusOnLastItem,
      closeMenu = _useMenuContext2.closeMenu,
      focusableItems = _useMenuContext2.focusableItems,
      buttonRef = _useMenuContext2.buttonRef,
      menuId = _useMenuContext2.menuId,
      buttonId = _useMenuContext2.buttonId,
      menuRef = _useMenuContext2.menuRef,
      closeOnBlur = _useMenuContext2.closeOnBlur,
      placement = _useMenuContext2.placement;

  var handleKeyDown = function handleKeyDown(event) {
    var count = focusableItems.current.length;
    var nextIndex;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = (index + 1) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex = (index - 1 + count) % count;
      focusAtIndex(nextIndex);
    } else if (event.key === "Home") {
      focusOnFirstItem();
    } else if (event.key === "End") {
      focusOnLastItem();
    } else if (event.key === "Tab") {
      event.preventDefault();
    } else if (event.key === "Escape") {
      closeMenu();
    } // Set focus based on first character


    if (/^[a-z0-9_-]$/i.test(event.key)) {
      event.stopPropagation();
      event.preventDefault();
      var foundNode = focusableItems.current.find(function (item) {
        return item.textContent.toLowerCase().startsWith(event.key);
      });

      if (foundNode) {
        nextIndex = focusableItems.current.indexOf(foundNode);
        focusAtIndex(nextIndex);
      }
    }

    onKeyDown && onKeyDown(event);
  }; // Close the menu on blur


  var handleBlur = function handleBlur(event) {
    if (closeOnBlur && isOpen && menuRef.current && buttonRef.current && !menuRef.current.contains(event.relatedTarget) && !buttonRef.current.contains(event.relatedTarget)) {
      closeMenu();
    }

    onBlur && onBlur(event);
  };

  var styleProps = useMenuListStyle();
  return jsx(Popper, _extends({
    usePortal: false,
    isOpen: isOpen,
    anchorEl: buttonRef.current,
    placement: placement,
    modifiers: {
      preventOverflow: {
        enabled: true,
        boundariesElement: "viewport"
      }
    },
    minW: "3xs",
    rounded: "md",
    role: "menu",
    ref: menuRef,
    id: menuId,
    py: 2,
    "aria-labelledby": buttonId,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    tabIndex: -1,
    zIndex: "1",
    _focus: {
      outline: 0
    }
  }, styleProps, props));
}; //////////////////////////////////////////////////////////////////////////////////////////


var MenuItem = forwardRef(function (_ref4, ref) {
  var isDisabled = _ref4.isDisabled,
      onClick = _ref4.onClick,
      onMouseLeave = _ref4.onMouseLeave,
      onMouseEnter = _ref4.onMouseEnter,
      onKeyDown = _ref4.onKeyDown,
      _ref4$role = _ref4.role,
      role = _ref4$role === void 0 ? "menuitem" : _ref4$role,
      props = _objectWithoutPropertiesLoose(_ref4, ["isDisabled", "onClick", "onMouseLeave", "onMouseEnter", "onKeyDown", "role"]);

  var _useMenuContext3 = useMenuContext(),
      focusableItems = _useMenuContext3.focusableItems,
      focusAtIndex = _useMenuContext3.focusAtIndex,
      closeOnSelect = _useMenuContext3.closeOnSelect,
      closeMenu = _useMenuContext3.closeMenu;

  var styleProps = useMenuItemStyle();
  return jsx(PseudoBox, _extends({
    as: "button",
    ref: ref,
    display: "flex",
    textDecoration: "none",
    color: "inherit",
    minHeight: "32px",
    alignItems: "center",
    textAlign: "left",
    outline: "none",
    px: 4,
    role: role,
    tabIndex: -1,
    disabled: isDisabled,
    "aria-disabled": isDisabled,
    onClick: wrapEvent(onClick, function (event) {
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      if (closeOnSelect) {
        closeMenu();
      }
    }),
    onMouseEnter: wrapEvent(onMouseEnter, function (event) {
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      if (focusableItems && focusableItems.current.length > 0) {
        var nextIndex = focusableItems.current.indexOf(event.currentTarget);
        focusAtIndex(nextIndex);
      }
    }),
    onMouseLeave: wrapEvent(onMouseLeave, function () {
      focusAtIndex(-1);
    }),
    onKeyDown: wrapEvent(onKeyDown, function (event) {
      if (isDisabled) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        if (onClick) {
          onClick();
        }

        if (closeOnSelect) {
          closeMenu();
        }
      }
    })
  }, styleProps, props));
});
MenuItem.displayName = "MenuItem"; //////////////////////////////////////////////////////////////////////////////////////////

var MenuDivider = forwardRef(function (props, ref) {
  return jsx(Divider, _extends({
    ref: ref,
    orientation: "horizontal"
  }, props));
});
MenuDivider.displayName = "MenuDivider"; //////////////////////////////////////////////////////////////////////////////////////////

var MenuGroup = forwardRef(function (_ref5, ref) {
  var children = _ref5.children,
      title = _ref5.title,
      rest = _objectWithoutPropertiesLoose(_ref5, ["children", "title"]);

  return jsx(Box, {
    ref: ref,
    role: "group"
  }, title && jsx(Text, _extends({
    mx: 4,
    my: 2,
    fontWeight: "semibold",
    fontSize: "sm"
  }, rest), title), children);
});
MenuGroup.displayName = "MenuGroup"; //////////////////////////////////////////////////////////////////////////////////////////

export default Menu;
export { MenuButton, MenuDivider, MenuGroup, MenuList, MenuItem };
export * from "./MenuOption";