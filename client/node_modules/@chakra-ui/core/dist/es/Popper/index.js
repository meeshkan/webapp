import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Popper Component
 *
 * The following code is a derivative of the amazing work done by the Material UI team.
 * Original source: https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/Popper/Popper.js
 */

/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useImperativeHandle, useState, useCallback } from "react";
import PopperJS from "popper.js";
import Portal from "../Portal";
import PseudoBox from "../PseudoBox";
import Box from "../Box";
import { useForkRef, setRef, createChainedFunction } from "../utils";
import getPopperArrowStyle from "./styles";
/**
 * Flips placement if in <body dir="rtl" />
 * @param {string} placement
 */

function flipPlacement(placement) {
  var direction = typeof window !== "undefined" && document.body.getAttribute("dir") || "ltr";

  if (direction !== "rtl") {
    return placement;
  }

  switch (placement) {
    case "bottom-end":
      return "bottom-start";

    case "bottom-start":
      return "bottom-end";

    case "top-end":
      return "top-start";

    case "top-start":
      return "top-end";

    default:
      return placement;
  }
}

function getAnchorEl(anchorEl) {
  return typeof anchorEl === "function" ? anchorEl() : anchorEl;
}

var useEnhancedEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
var Popper = forwardRef(function (_ref, ref) {
  var anchorEl = _ref.anchorEl,
      children = _ref.children,
      gutter = _ref.gutter,
      container = _ref.container,
      _ref$usePortal = _ref.usePortal,
      usePortal = _ref$usePortal === void 0 ? true : _ref$usePortal,
      _ref$unmountOnExit = _ref.unmountOnExit,
      unmountOnExit = _ref$unmountOnExit === void 0 ? true : _ref$unmountOnExit,
      modifiers = _ref.modifiers,
      isOpen = _ref.isOpen,
      _ref$placement = _ref.placement,
      initialPlacement = _ref$placement === void 0 ? "bottom" : _ref$placement,
      _ref$popperOptions = _ref.popperOptions,
      popperOptions = _ref$popperOptions === void 0 ? {} : _ref$popperOptions,
      popperRefProp = _ref.popperRef,
      _ref$willUseTransitio = _ref.willUseTransition,
      willUseTransition = _ref$willUseTransitio === void 0 ? false : _ref$willUseTransitio,
      arrowSize = _ref.arrowSize,
      arrowShadowColor = _ref.arrowShadowColor,
      hasArrow = _ref.hasArrow,
      rest = _objectWithoutPropertiesLoose(_ref, ["anchorEl", "children", "gutter", "container", "usePortal", "unmountOnExit", "modifiers", "isOpen", "placement", "popperOptions", "popperRef", "willUseTransition", "arrowSize", "arrowShadowColor", "hasArrow"]);

  var tooltipRef = useRef(null);
  var ownRef = useForkRef(tooltipRef, ref);
  var popperRef = useRef(null);
  var handlePopperRef = useForkRef(popperRef, popperRefProp);
  var handlePopperRefRef = useRef(handlePopperRef);
  useEnhancedEffect(function () {
    handlePopperRefRef.current = handlePopperRef;
  }, [handlePopperRef]);
  useImperativeHandle(popperRefProp, function () {
    return popperRef.current;
  }, []);

  var _useState = useState(true),
      exited = _useState[0],
      setExited = _useState[1];

  var rtlPlacement = flipPlacement(initialPlacement);

  var _useState2 = useState(rtlPlacement),
      placement = _useState2[0],
      setPlacement = _useState2[1];

  if (rtlPlacement !== placement) {
    setPlacement(rtlPlacement);
  }

  var handleOpen = useCallback(function () {
    var popperNode = tooltipRef.current;

    if (!popperNode || !anchorEl || !isOpen) {
      return;
    }

    if (popperRef.current) {
      popperRef.current.destroy();
      handlePopperRefRef.current(null);
    }

    var handlePopperUpdate = function handlePopperUpdate(data) {
      setPlacement(data.placement);
    };

    var popper = new PopperJS(getAnchorEl(anchorEl), popperNode, _objectSpread({
      placement: rtlPlacement
    }, popperOptions, {
      modifiers: _objectSpread({}, usePortal && {
        preventOverflow: {
          boundariesElement: "window"
        }
      }, {}, modifiers, {}, popperOptions.modifiers),
      onUpdate: createChainedFunction(handlePopperUpdate, popperOptions.onUpdate)
    }));
    handlePopperRefRef.current(popper);
  }, [anchorEl, usePortal, modifiers, isOpen, rtlPlacement, popperOptions]);
  var handleRef = useCallback(function (node) {
    setRef(ownRef, node);
    handleOpen();
  }, [ownRef, handleOpen]);

  var handleEnter = function handleEnter() {
    setExited(false);
  };

  var handleClose = function handleClose() {
    if (!popperRef.current) {
      return;
    }

    popperRef.current.destroy();
    handlePopperRefRef.current(null);
  };

  var handleExited = function handleExited() {
    setExited(true);
    handleClose();
  };

  useEffect(function () {
    handleOpen();
  }, [handleOpen]);
  useEffect(function () {
    return function () {
      handleClose();
    };
  }, []);
  useEffect(function () {
    if (!isOpen && !willUseTransition) {
      handleClose();
    }
  }, [isOpen, willUseTransition]);

  if (unmountOnExit && !isOpen && (!willUseTransition || exited)) {
    return null;
  }

  var childProps = {
    placement: placement
  };

  if (willUseTransition) {
    childProps.transition = {
      "in": isOpen,
      onEnter: handleEnter,
      onExited: handleExited
    };
  }

  return jsx(Portal, {
    isDisabled: !usePortal,
    container: container
  }, jsx(PseudoBox, _extends({
    ref: handleRef,
    pos: "absolute",
    css: getPopperArrowStyle({
      arrowSize: arrowSize,
      arrowShadowColor: arrowShadowColor,
      hasArrow: hasArrow
    })
  }, rest), typeof children === "function" ? children(childProps) : children));
});
export default Popper;
export var PopperArrow = function PopperArrow(props) {
  return jsx(Box, _extends({
    "x-arrow": "",
    role: "presentation",
    bg: "inherit"
  }, props));
};