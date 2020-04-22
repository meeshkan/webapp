"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ModalContent = exports.ModalOverlay = exports.ModalBody = exports.ModalFooter = exports.ModalTransition = exports.ModalHeader = exports.modalContentStyle = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@emotion/core");

var _dialog = require("@reach/dialog");

var _react = require("react");

var _renderprops = require("react-spring/renderprops.cjs");

var _ThemeProvider = require("../ThemeProvider");

var _ColorModeProvider = require("../ColorModeProvider");

var _Box = _interopRequireWildcard(require("../Box"));

var _Flex = _interopRequireDefault(require("../Flex"));

var _styledBase = _interopRequireDefault(require("@emotion/styled-base"));

var _config = _interopRequireDefault(require("../Box/config"));

var _reactSpring = require("react-spring");

/** @jsx jsx */
var ModalHeader = function ModalHeader(props) {
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    px: 6,
    py: 4,
    as: "header",
    position: "relative",
    fontSize: "xl",
    fontWeight: "semibold"
  }, props));
};

exports.ModalHeader = ModalHeader;

var ModalFooter = function ModalFooter(props) {
  return (0, _core.jsx)(_Flex["default"], (0, _extends2["default"])({
    px: 6,
    py: 4,
    as: "footer",
    justifyContent: "flex-end"
  }, props));
};

exports.ModalFooter = ModalFooter;

var ModalBody = function ModalBody(props) {
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    px: 6,
    py: 2,
    flex: "1"
  }, props));
};

exports.ModalBody = ModalBody;
var StyledDialogOverlay = (0, _styledBase["default"])(_dialog.DialogOverlay)(_Box.systemProps, _config["default"]);
var ModalOverlay = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$bg = _ref.bg,
      bg = _ref$bg === void 0 ? "rgba(16,22,26,0.7)" : _ref$bg,
      zIndex = _ref.zIndex,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["bg", "zIndex"]);
  return (0, _core.jsx)(StyledDialogOverlay, (0, _extends2["default"])({
    ref: ref,
    position: "fixed",
    zIndex: zIndex,
    bottom: "0",
    top: "0",
    left: "0",
    right: "0",
    overflowY: "auto",
    bg: bg
  }, props));
});
exports.ModalOverlay = ModalOverlay;

var modalContentStyle = function modalContentStyle(_ref2) {
  var colorMode = _ref2.colorMode;
  var style = {
    light: {
      bg: "#fff",
      boxShadow: "0 7px 14px 0 rgba(0,0,0, 0.1), 0 3px 6px 0 rgba(0, 0, 0, .07)"
    },
    dark: {
      bg: "gray.700",
      boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px"
    }
  };
  return style[colorMode];
};

exports.modalContentStyle = modalContentStyle;
_reactSpring.animated.Box = (0, _reactSpring.animated)(_Box["default"]);
var ModalContent = (0, _react.forwardRef)(function (props, ref) {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var theme = (0, _ThemeProvider.useTheme)();
  var styleProps = modalContentStyle({
    colorMode: colorMode,
    theme: theme
  });
  return (0, _core.jsx)(_reactSpring.animated.Box, (0, _extends2["default"])({
    as: _dialog.DialogContent,
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    ref: ref
  }, styleProps, props));
});
exports.ModalContent = ModalContent;

var ModalTransition = function ModalTransition(_ref3) {
  var isOpen = _ref3.isOpen,
      _ref3$duration = _ref3.duration,
      duration = _ref3$duration === void 0 ? 150 : _ref3$duration,
      children = _ref3.children;
  return (0, _core.jsx)(_renderprops.Transition, {
    items: isOpen,
    from: {
      opacity: 0,
      y: 10
    },
    enter: {
      opacity: 1,
      y: 0
    },
    leave: {
      opacity: 0,
      y: -10
    },
    config: {
      duration: duration
    }
  }, function (isOpen) {
    return isOpen && function (styles) {
      return children(styles);
    };
  });
};

exports.ModalTransition = ModalTransition;