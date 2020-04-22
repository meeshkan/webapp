"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.DrawerCloseButton = exports.DrawerTransition = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _renderprops = require("react-spring/renderprops.cjs");

var _Modal = require("../Modal");

exports.DrawerHeader = _Modal.ModalHeader;
exports.DrawerFooter = _Modal.ModalFooter;
exports.DrawerBody = _Modal.ModalBody;
exports.DrawerOverlay = _Modal.ModalOverlay;
exports.DrawerContent = _Modal.ModalContent;

var _CloseButton = _interopRequireDefault(require("../CloseButton"));

var _ColorModeProvider = require("../ColorModeProvider");

var _react = require("react");

/** @jsx jsx */
var DrawerTransition = function DrawerTransition(_ref) {
  var isOpen = _ref.isOpen,
      children = _ref.children,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 200 : _ref$duration,
      placement = _ref.placement,
      isFullHeight = _ref.isFullHeight;
  var placements = {
    bottom: {
      maxWidth: "100%",
      height: isFullHeight ? "100vh" : "auto",
      bottom: 0,
      left: 0,
      right: 0
    },
    top: {
      maxWidth: "100%",
      height: isFullHeight ? "100vh" : "auto",
      top: 0,
      left: 0,
      right: 0
    },
    left: {
      height: "100vh",
      left: 0,
      top: 0
    },
    right: {
      right: 0,
      top: 0,
      height: "100vh"
    }
  };
  var transitionOptions = {
    bottom: {
      offset: "100%",
      transform: function transform(y) {
        return "translateY(" + y + ")";
      }
    },
    top: {
      offset: "-100%",
      transform: function transform(y) {
        return "translateY(" + y + ")";
      }
    },
    left: {
      offset: "-100%",
      transform: function transform(x) {
        return "translateX(" + x + ")";
      }
    },
    right: {
      offset: "100%",
      transform: function transform(x) {
        return "translateX(" + x + ")";
      }
    }
  };
  var _transitionOptions$pl = transitionOptions[placement],
      transform = _transitionOptions$pl.transform,
      offset = _transitionOptions$pl.offset;
  return (0, _core.jsx)(_renderprops.Transition, {
    items: isOpen,
    from: {
      opacity: 0,
      offset: offset
    },
    enter: {
      opacity: 1,
      offset: "0%"
    },
    leave: {
      opacity: 0,
      offset: offset
    },
    config: {
      duration: duration
    }
  }, function (isOpen) {
    return isOpen && function (styles) {
      return children({
        reactSpringStyles: styles,
        transformStyle: transform(styles.offset),
        placementStyle: placements[placement]
      });
    };
  });
};

exports.DrawerTransition = DrawerTransition;
var DrawerCloseButton = (0, _react.forwardRef)(function (_ref2, ref) {
  var onClick = _ref2.onClick,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["onClick"]);

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var hoverColor = {
    light: "blackAlpha.100",
    dark: "whiteAlpha.100"
  };
  var activeColor = {
    light: "blackAlpha.200",
    dark: "whiteAlpha.200"
  };
  return (0, _core.jsx)(_CloseButton["default"], (0, _extends2["default"])({
    ref: ref,
    onClick: onClick,
    position: "fixed",
    zIndex: "1",
    top: "8px",
    right: "12px",
    _hover: {
      bg: hoverColor[colorMode]
    },
    _active: {
      bg: activeColor[colorMode]
    }
  }, rest));
});
exports.DrawerCloseButton = DrawerCloseButton;