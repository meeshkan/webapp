import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { cloneElement, useRef, Children, Fragment } from "react";
import { useColorMode } from "../ColorModeProvider";
import Box from "../Box";
import useDisclosure from "../useDisclosure";
import { useId } from "@reach/auto-id";
import Popper, { PopperArrow } from "../Popper";
import VisuallyHidden from "../VisuallyHidden";

var wrapEvent = function wrapEvent(child, theirHandler, ourHandler) {
  return function (event) {
    if (typeof child !== "string" && child.props[theirHandler]) {
      child.props[theirHandler](event);
    }

    if (!event.defaultPrevented) {
      return ourHandler(event);
    }
  };
};

var Tooltip = function Tooltip(_ref) {
  var label = _ref.label,
      ariaLabel = _ref["aria-label"],
      _ref$showDelay = _ref.showDelay,
      showDelay = _ref$showDelay === void 0 ? 0 : _ref$showDelay,
      _ref$hideDelay = _ref.hideDelay,
      hideDelay = _ref$hideDelay === void 0 ? 0 : _ref$hideDelay,
      _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? "auto" : _ref$placement,
      children = _ref.children,
      hasArrow = _ref.hasArrow,
      closeOnClick = _ref.closeOnClick,
      defaultIsOpen = _ref.defaultIsOpen,
      shouldWrapChildren = _ref.shouldWrapChildren,
      controlledIsOpen = _ref.isOpen,
      onOpenProp = _ref.onOpen,
      onCloseProp = _ref.onClose,
      rest = _objectWithoutPropertiesLoose(_ref, ["label", "aria-label", "showDelay", "hideDelay", "placement", "children", "hasArrow", "closeOnClick", "defaultIsOpen", "shouldWrapChildren", "isOpen", "onOpen", "onClose"]);

  var _useDisclosure = useDisclosure(defaultIsOpen || false),
      isOpen = _useDisclosure.isOpen,
      onClose = _useDisclosure.onClose,
      onOpen = _useDisclosure.onOpen;

  var _useRef = useRef(controlledIsOpen != null),
      isControlled = _useRef.current;

  var _isOpen = isControlled ? controlledIsOpen : isOpen;

  var referenceRef = useRef();
  var enterTimeoutRef = useRef();
  var exitTimeoutRef = useRef();

  var openWithDelay = function openWithDelay() {
    enterTimeoutRef.current = setTimeout(onOpen, showDelay);
  };

  var closeWithDelay = function closeWithDelay() {
    clearTimeout(enterTimeoutRef.current);
    exitTimeoutRef.current = setTimeout(onClose, hideDelay);
  };

  var tooltipId = "tooltip-" + useId();

  var handleOpen = function handleOpen() {
    if (!isControlled) {
      openWithDelay();
    }

    if (onOpenProp) {
      onOpenProp();
    }
  };

  var handleClose = function handleClose() {
    if (!isControlled) {
      closeWithDelay();
    }

    if (onCloseProp) {
      onCloseProp();
    }
  };

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var _bg = colorMode === "dark" ? "gray.300" : "gray.700";

  var _color = colorMode === "dark" ? "gray.900" : "whiteAlpha.900";

  var handleClick = wrapEvent(children, "onClick", function () {
    if (closeOnClick) {
      closeWithDelay();
    }
  });

  var referenceProps = _objectSpread({
    ref: referenceRef,
    onMouseEnter: wrapEvent(children, "onMouseEnter", handleOpen),
    onMouseLeave: wrapEvent(children, "onMouseLeave", handleClose),
    onClick: handleClick,
    onFocus: wrapEvent(children, "onFocus", handleOpen),
    onBlur: wrapEvent(children, "onBlur", handleClose)
  }, _isOpen && {
    "aria-describedby": tooltipId
  });

  var clone;

  if (typeof children === "string" || shouldWrapChildren) {
    clone = jsx(Box, _extends({
      as: "span",
      tabIndex: "0"
    }, referenceProps), children);
  } else {
    clone = cloneElement(Children.only(children), referenceProps);
  }

  var hasAriaLabel = ariaLabel != null;
  return jsx(Fragment, null, clone, jsx(Popper, _extends({
    usePortal: true,
    isOpen: _isOpen,
    placement: placement,
    timeout: 200,
    modifiers: {
      offset: {
        enabled: true,
        offset: "0, 8"
      }
    },
    anchorEl: referenceRef.current,
    arrowSize: "10px",
    hasArrow: hasArrow,
    px: "8px",
    py: "2px",
    id: hasAriaLabel ? undefined : tooltipId,
    role: hasAriaLabel ? undefined : "tooltip",
    bg: _bg,
    borderRadius: "sm",
    fontWeight: "medium",
    pointerEvents: "none",
    color: _color,
    fontSize: "sm",
    shadow: "md",
    maxW: "320px"
  }, rest), label, hasAriaLabel && jsx(VisuallyHidden, {
    role: "tooltip",
    id: tooltipId
  }, ariaLabel), hasArrow && jsx(PopperArrow, null)));
};

export default Tooltip;