import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect, useState, forwardRef, useRef } from "react";
import Box from "../Box";
export function useHasImageLoaded(props) {
  var src = props.src,
      onLoad = props.onLoad,
      onError = props.onError,
      _props$enabled = props.enabled,
      enabled = _props$enabled === void 0 ? true : _props$enabled;
  var isMounted = useRef(true);

  var _useState = useState(false),
      hasLoaded = _useState[0],
      setHasLoaded = _useState[1];

  useEffect(function () {
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
  useEffect(function () {
    return function () {
      isMounted.current = false;
    };
  }, []);
  return hasLoaded;
}
var NativeImage = forwardRef(function (_ref, ref) {
  var htmlWidth = _ref.htmlWidth,
      htmlHeight = _ref.htmlHeight,
      alt = _ref.alt,
      props = _objectWithoutPropertiesLoose(_ref, ["htmlWidth", "htmlHeight", "alt"]);

  return jsx("img", _extends({
    width: htmlWidth,
    height: htmlHeight,
    ref: ref,
    alt: alt
  }, props));
});
var Image = forwardRef(function (props, ref) {
  var src = props.src,
      fallbackSrc = props.fallbackSrc,
      onError = props.onError,
      onLoad = props.onLoad,
      ignoreFallback = props.ignoreFallback,
      rest = _objectWithoutPropertiesLoose(props, ["src", "fallbackSrc", "onError", "onLoad", "ignoreFallback"]);

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
  return jsx(Box, _extends({
    as: NativeImage,
    ref: ref
  }, imageProps, rest));
});
Image.displayName = "Image";
export default Image;