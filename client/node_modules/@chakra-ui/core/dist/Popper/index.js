"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.PopperArrow = exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = _interopRequireWildcard(require("react"));

var _popper = _interopRequireDefault(require("popper.js"));

var _Portal = _interopRequireDefault(require("../Portal"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _Box = _interopRequireDefault(require("../Box"));

var _utils = require("../utils");

var _styles = _interopRequireDefault(require("./styles"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var useEnhancedEffect = typeof window !== "undefined" ? _react.useLayoutEffect : _react.useEffect;
var Popper = (0, _react.forwardRef)(function (_ref, ref) {
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
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["anchorEl", "children", "gutter", "container", "usePortal", "unmountOnExit", "modifiers", "isOpen", "placement", "popperOptions", "popperRef", "willUseTransition", "arrowSize", "arrowShadowColor", "hasArrow"]);
  var tooltipRef = (0, _react.useRef)(null);
  var ownRef = (0, _utils.useForkRef)(tooltipRef, ref);
  var popperRef = (0, _react.useRef)(null);
  var handlePopperRef = (0, _utils.useForkRef)(popperRef, popperRefProp);
  var handlePopperRefRef = (0, _react.useRef)(handlePopperRef);
  useEnhancedEffect(function () {
    handlePopperRefRef.current = handlePopperRef;
  }, [handlePopperRef]);
  (0, _react.useImperativeHandle)(popperRefProp, function () {
    return popperRef.current;
  }, []);

  var _useState = (0, _react.useState)(true),
      exited = _useState[0],
      setExited = _useState[1];

  var rtlPlacement = flipPlacement(initialPlacement);

  var _useState2 = (0, _react.useState)(rtlPlacement),
      placement = _useState2[0],
      setPlacement = _useState2[1];

  if (rtlPlacement !== placement) {
    setPlacement(rtlPlacement);
  }

  var handleOpen = (0, _react.useCallback)(function () {
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

    var popper = new _popper["default"](getAnchorEl(anchorEl), popperNode, _objectSpread({
      placement: rtlPlacement
    }, popperOptions, {
      modifiers: _objectSpread({}, usePortal && {
        preventOverflow: {
          boundariesElement: "window"
        }
      }, {}, modifiers, {}, popperOptions.modifiers),
      onUpdate: (0, _utils.createChainedFunction)(handlePopperUpdate, popperOptions.onUpdate)
    }));
    handlePopperRefRef.current(popper);
  }, [anchorEl, usePortal, modifiers, isOpen, rtlPlacement, popperOptions]);
  var handleRef = (0, _react.useCallback)(function (node) {
    (0, _utils.setRef)(ownRef, node);
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

  (0, _react.useEffect)(function () {
    handleOpen();
  }, [handleOpen]);
  (0, _react.useEffect)(function () {
    return function () {
      handleClose();
    };
  }, []);
  (0, _react.useEffect)(function () {
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

  return (0, _core.jsx)(_Portal["default"], {
    isDisabled: !usePortal,
    container: container
  }, (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    ref: handleRef,
    pos: "absolute",
    css: (0, _styles["default"])({
      arrowSize: arrowSize,
      arrowShadowColor: arrowShadowColor,
      hasArrow: hasArrow
    })
  }, rest), typeof children === "function" ? children(childProps) : children));
});
var _default = Popper;
exports["default"] = _default;

var PopperArrow = function PopperArrow(props) {
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    "x-arrow": "",
    role: "presentation",
    bg: "inherit"
  }, props));
};

exports.PopperArrow = PopperArrow;