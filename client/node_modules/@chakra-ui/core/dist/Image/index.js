"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useHasImageLoaded = useHasImageLoaded;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

/** @jsx jsx */
function useHasImageLoaded(props) {
  var src = props.src,
      onLoad = props.onLoad,
      onError = props.onError,
      _props$enabled = props.enabled,
      enabled = _props$enabled === void 0 ? true : _props$enabled;
  var isMounted = (0, _react.useRef)(true);

  var _useState = (0, _react.useState)(false),
      hasLoaded = _useState[0],
      setHasLoaded = _useState[1];

  (0, _react.useEffect)(function () {
    if (!src || !enabled) {
      return;
    }

    var image = new window.Image();
    image.src = src;

    image.onload = function (event) {
      if (isMounted.current) {
        setHasLoaded(true);
        onLoad && onLoad(event);
      }
    };

    image.onerror = function (event) {
      if (isMounted.current) {
        setHasLoaded(false);
        onError && onError(event);
      }
    };
  }, [src, onLoad, onError, enabled]);
  (0, _react.useEffect)(function () {
    return function () {
      isMounted.current = false;
    };
  }, []);
  return hasLoaded;
}

var NativeImage = (0, _react.forwardRef)(function (_ref, ref) {
  var htmlWidth = _ref.htmlWidth,
      htmlHeight = _ref.htmlHeight,
      alt = _ref.alt,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["htmlWidth", "htmlHeight", "alt"]);
  return (0, _core.jsx)("img", (0, _extends2["default"])({
    width: htmlWidth,
    height: htmlHeight,
    ref: ref,
    alt: alt
  }, props));
});
var Image = (0, _react.forwardRef)(function (props, ref) {
  var src = props.src,
      fallbackSrc = props.fallbackSrc,
      onError = props.onError,
      onLoad = props.onLoad,
      ignoreFallback = props.ignoreFallback,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(props, ["src", "fallbackSrc", "onError", "onLoad", "ignoreFallback"]);
  var hasLoaded = useHasImageLoaded({
    src: src,
    onLoad: onLoad,
    onError: onError,
    enabled: !Boolean(ignoreFallback)
  });
  var imageProps = ignoreFallback ? {
    src: src,
    onLoad: onLoad,
    onError: onError
  } : {
    src: hasLoaded ? src : fallbackSrc
  };
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: NativeImage,
    ref: ref
  }, imageProps, rest));
});
Image.displayName = "Image";
var _default = Image;
exports["default"] = _default;