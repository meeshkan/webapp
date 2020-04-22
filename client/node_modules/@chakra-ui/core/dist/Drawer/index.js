"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.DrawerCloseButton = exports.DrawerOverlay = exports.DrawerContent = exports.Drawer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Modal = require("../Modal");

exports.DrawerBody = _Modal.ModalBody;
exports.DrawerFooter = _Modal.ModalFooter;
exports.DrawerHeader = _Modal.ModalHeader;

var _Transition = require("../Transition");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DrawerContext = (0, _react.createContext)({});

var useDrawerContext = function useDrawerContext() {
  return (0, _react.useContext)(DrawerContext);
};

var Drawer = function Drawer(_ref) {
  var isOpen = _ref.isOpen,
      onClose = _ref.onClose,
      isFullHeight = _ref.isFullHeight,
      _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? "right" : _ref$placement,
      finalFocusRef = _ref.finalFocusRef,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? "xs" : _ref$size,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["isOpen", "onClose", "isFullHeight", "placement", "finalFocusRef", "size"]);
  return (0, _core.jsx)(_Transition.Slide, {
    "in": isOpen,
    from: placement,
    finalHeight: isFullHeight ? "100vh" : "auto"
  }, function (styles) {
    return (0, _core.jsx)(DrawerContext.Provider, {
      value: {
        styles: styles,
        size: size
      }
    }, (0, _core.jsx)(_Modal.Modal, (0, _extends2["default"])({
      isOpen: true,
      onClose: onClose,
      finalFocusRef: finalFocusRef,
      formatIds: function formatIds(id) {
        return {
          content: "drawer-" + id,
          header: "drawer-" + id + "-header",
          body: "drawer-" + id + "-body"
        };
      }
    }, props)));
  });
};

exports.Drawer = Drawer;
var drawerSizes = {
  xs: "xs",
  sm: "md",
  md: "lg",
  lg: "2xl",
  xl: "4xl",
  full: "100vw"
};
var DrawerContent = (0, _react.forwardRef)(function (props, ref) {
  var _useDrawerContext = useDrawerContext(),
      _useDrawerContext$sty = _useDrawerContext.styles,
      opacity = _useDrawerContext$sty.opacity,
      placementStyles = (0, _objectWithoutPropertiesLoose2["default"])(_useDrawerContext$sty, ["opacity"]),
      size = _useDrawerContext.size;

  var _size = size in drawerSizes ? drawerSizes[size] : size;

  return (0, _core.jsx)(_Modal.ModalContent, (0, _extends2["default"])({
    ref: ref,
    noStyles: true,
    pos: "fixed",
    maxWidth: _size
  }, props, {
    style: _objectSpread({}, props.styles, {}, placementStyles)
  }));
});
exports.DrawerContent = DrawerContent;
DrawerContent.displayName = "DrawerContent";
var DrawerOverlay = (0, _react.forwardRef)(function (props, ref) {
  var _useDrawerContext2 = useDrawerContext(),
      styles = _useDrawerContext2.styles;

  return (0, _core.jsx)(_Modal.ModalOverlay, (0, _extends2["default"])({
    ref: ref,
    opacity: styles.opacity
  }, props));
});
exports.DrawerOverlay = DrawerOverlay;
DrawerOverlay.displayName = "DrawerOverlay";
var DrawerCloseButton = (0, _react.forwardRef)(function (_ref2, ref) {
  var onClick = _ref2.onClick,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["onClick"]);
  return (0, _core.jsx)(_Modal.ModalCloseButton, (0, _extends2["default"])({
    ref: ref,
    position: "fixed",
    zIndex: "1"
  }, rest));
});
exports.DrawerCloseButton = DrawerCloseButton;
DrawerCloseButton.displayName = "DrawerCloseButton";