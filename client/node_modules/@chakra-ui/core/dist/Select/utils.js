"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var rootOptions = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginBottom", "marginLeft", "marginRight", "marginY", "marginX", "flex", "flexBasis", "width", "minWidth", "maxWidth", "maxW", "minW", "w", "zIndex", "top", "right", "bottom", "left", "position", "pos"];

var splitProps = function splitProps(props) {
  var rootProps = {};
  var selectProps = {};

  for (var key in props) {
    if (rootOptions.includes(key)) {
      rootProps[key] = props[key];
    } else {
      selectProps[key] = props[key];
    }
  }

  return [rootProps, selectProps];
};

var _default = splitProps;
exports["default"] = _default;