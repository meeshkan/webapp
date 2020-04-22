"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
var _exportNames = {
  useMenuContext: true,
  MenuButton: true,
  MenuDivider: true,
  MenuGroup: true,
  MenuList: true,
  MenuItem: true
};
exports.useMenuContext = useMenuContext;
exports.MenuItem = exports.MenuList = exports.MenuGroup = exports.MenuDivider = exports.MenuButton = exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@emotion/core");

var _autoId = require("@reach/auto-id");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _Text = _interopRequireDefault(require("../Text"));

var _ColorModeProvider = require("../ColorModeProvider");

var _usePrevious = _interopRequireDefault(require("../usePrevious"));

var _utils = require("../utils");

var _styles = require("./styles");

var _Divider = _interopRequireDefault(require("../Divider"));

var _Popper = _interopRequireDefault(require("../Popper"));

var _MenuOption = require("./MenuOption");

Object.keys(_MenuOption).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _MenuOption[key];
});

/** @jsx jsx */
var MenuContext = (0, _react.createContext)();

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

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var _useState = (0, _react.useState)(defaultActiveIndex || -1),
      activeIndex = _useState[0],
      setActiveIndex = _useState[1];

  var _useState2 = (0, _react.useState)(defaultIsOpen || false),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var _useRef = (0, _react.useRef)(isOpenProp != null),
      isControlled = _useRef.current;

  var _isOpen = isControlled ? isOpenProp : isOpen;

  var menuId = "menu-" + (0, _autoId.useId)();
  var buttonId = "menubutton-" + (0, _autoId.useId)();
  var focusableItems = (0, _react.useRef)(null);
  var menuRef = (0, _react.useRef)(null);
  var buttonRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (_isOpen && menuRef && menuRef.current) {
      var focusables = (0, _utils.getFocusables)(menuRef.current).filter(function (node) {
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

  var wasPreviouslyOpen = (0, _usePrevious["default"])(_isOpen);
  (0, _react.useEffect)(function () {
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
  return (0, _core.jsx)(MenuContext.Provider, {
    value: context
  }, typeof children === "function" ? children({
    isOpen: _isOpen,
    onClose: closeMenu
  }) : children);
};

function useMenuContext() {
  var context = (0, _react.useContext)(MenuContext);

  if (context === undefined) {
    throw new Error("useMenuContext must be used within a MenuContext Provider");
  }

  return context;
} //////////////////////////////////////////////////////////////////////////////////////////


var PseudoButton = (0, _react.forwardRef)(function (props, ref) {
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    ref: ref,
    as: "button"
  }, props));
});
PseudoButton.displayName = "PseudoButton";
var MenuButton = (0, _react.forwardRef)(function (_ref2, ref) {
  var onClick = _ref2.onClick,
      onKeyDown = _ref2.onKeyDown,
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? PseudoButton : _ref2$as,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["onClick", "onKeyDown", "as"]);

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

  var menuButtonRef = (0, _utils.useForkRef)(buttonRef, ref);
  return (0, _core.jsx)(Comp, (0, _extends2["default"])({
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
    "aria-controls": menuId,
    id: buttonId,
    role: "button",
    ref: menuButtonRef,
    onClick: (0, _utils.wrapEvent)(onClick, function () {
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
    onKeyDown: (0, _utils.wrapEvent)(onKeyDown, function (event) {
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
exports.MenuButton = MenuButton;
MenuButton.displayName = "MenuButton"; //////////////////////////////////////////////////////////////////////////////////////////

var MenuList = function MenuList(_ref3) {
  var onKeyDown = _ref3.onKeyDown,
      onBlur = _ref3.onBlur,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["onKeyDown", "onBlur"]);

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

  var styleProps = (0, _styles.useMenuListStyle)();
  return (0, _core.jsx)(_Popper["default"], (0, _extends2["default"])({
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


exports.MenuList = MenuList;
var MenuItem = (0, _react.forwardRef)(function (_ref4, ref) {
  var isDisabled = _ref4.isDisabled,
      onClick = _ref4.onClick,
      onMouseLeave = _ref4.onMouseLeave,
      onMouseEnter = _ref4.onMouseEnter,
      onKeyDown = _ref4.onKeyDown,
      _ref4$role = _ref4.role,
      role = _ref4$role === void 0 ? "menuitem" : _ref4$role,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref4, ["isDisabled", "onClick", "onMouseLeave", "onMouseEnter", "onKeyDown", "role"]);

  var _useMenuContext3 = useMenuContext(),
      focusableItems = _useMenuContext3.focusableItems,
      focusAtIndex = _useMenuContext3.focusAtIndex,
      closeOnSelect = _useMenuContext3.closeOnSelect,
      closeMenu = _useMenuContext3.closeMenu;

  var styleProps = (0, _styles.useMenuItemStyle)();
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
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
    onClick: (0, _utils.wrapEvent)(onClick, function (event) {
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      if (closeOnSelect) {
        closeMenu();
      }
    }),
    onMouseEnter: (0, _utils.wrapEvent)(onMouseEnter, function (event) {
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
    onMouseLeave: (0, _utils.wrapEvent)(onMouseLeave, function () {
      focusAtIndex(-1);
    }),
    onKeyDown: (0, _utils.wrapEvent)(onKeyDown, function (event) {
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
exports.MenuItem = MenuItem;
MenuItem.displayName = "MenuItem"; //////////////////////////////////////////////////////////////////////////////////////////

var MenuDivider = (0, _react.forwardRef)(function (props, ref) {
  return (0, _core.jsx)(_Divider["default"], (0, _extends2["default"])({
    ref: ref,
    orientation: "horizontal"
  }, props));
});
exports.MenuDivider = MenuDivider;
MenuDivider.displayName = "MenuDivider"; //////////////////////////////////////////////////////////////////////////////////////////

var MenuGroup = (0, _react.forwardRef)(function (_ref5, ref) {
  var children = _ref5.children,
      title = _ref5.title,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref5, ["children", "title"]);
  return (0, _core.jsx)(_Box["default"], {
    ref: ref,
    role: "group"
  }, title && (0, _core.jsx)(_Text["default"], (0, _extends2["default"])({
    mx: 4,
    my: 2,
    fontWeight: "semibold",
    fontSize: "sm"
  }, rest), title), children);
});
exports.MenuGroup = MenuGroup;
MenuGroup.displayName = "MenuGroup"; //////////////////////////////////////////////////////////////////////////////////////////

var _default = Menu;
exports["default"] = _default;