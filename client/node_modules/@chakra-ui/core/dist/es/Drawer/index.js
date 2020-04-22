import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { createContext, useContext, forwardRef } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalCloseButton } from "../Modal";
import { Slide } from "../Transition";
var DrawerContext = createContext({});

var useDrawerContext = function useDrawerContext() {
  return useContext(DrawerContext);
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
      props = _objectWithoutPropertiesLoose(_ref, ["isOpen", "onClose", "isFullHeight", "placement", "finalFocusRef", "size"]);

  return jsx(Slide, {
    "in": isOpen,
    from: placement,
    finalHeight: isFullHeight ? "100vh" : "auto"
  }, function (styles) {
    return jsx(DrawerContext.Provider, {
      value: {
        styles: styles,
        size: size
      }
    }, jsx(Modal, _extends({
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

var drawerSizes = {
  xs: "xs",
  sm: "md",
  md: "lg",
  lg: "2xl",
  xl: "4xl",
  full: "100vw"
};
var DrawerContent = forwardRef(function (props, ref) {
  var _useDrawerContext = useDrawerContext(),
      _useDrawerContext$sty = _useDrawerContext.styles,
      opacity = _useDrawerContext$sty.opacity,
      placementStyles = _objectWithoutPropertiesLoose(_useDrawerContext$sty, ["opacity"]),
      size = _useDrawerContext.size;

  var _size = size in drawerSizes ? drawerSizes[size] : size;

  return jsx(ModalContent, _extends({
    ref: ref,
    noStyles: true,
    pos: "fixed",
    maxWidth: _size
  }, props, {
    style: _objectSpread({}, props.styles, {}, placementStyles)
  }));
});
DrawerContent.displayName = "DrawerContent";
var DrawerOverlay = forwardRef(function (props, ref) {
  var _useDrawerContext2 = useDrawerContext(),
      styles = _useDrawerContext2.styles;

  return jsx(ModalOverlay, _extends({
    ref: ref,
    opacity: styles.opacity
  }, props));
});
DrawerOverlay.displayName = "DrawerOverlay";
var DrawerCloseButton = forwardRef(function (_ref2, ref) {
  var onClick = _ref2.onClick,
      rest = _objectWithoutPropertiesLoose(_ref2, ["onClick"]);

  return jsx(ModalCloseButton, _extends({
    ref: ref,
    position: "fixed",
    zIndex: "1"
  }, rest));
});
DrawerCloseButton.displayName = "DrawerCloseButton";
export { Drawer, DrawerContent, DrawerOverlay, ModalBody as DrawerBody, ModalHeader as DrawerHeader, ModalFooter as DrawerFooter, DrawerCloseButton };