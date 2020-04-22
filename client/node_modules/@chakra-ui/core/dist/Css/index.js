"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _css2 = _interopRequireDefault(require("@styled-system/css"));

var _config = require("../Box/config");

var css = function css(styleProps) {
  return (0, _css2["default"])((0, _config.transformAliasProps)(styleProps));
};

var _default = css;
exports["default"] = _default;