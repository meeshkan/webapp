"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _core = require("@emotion/core");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  flex-shrink: 0;\n  backface-visibility: hidden;\n  &:not(:root) {\n    overflow: hidden;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var Svg = (0, _styled["default"])(_Box["default"])(_templateObject());
var Icon = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "1em" : _ref$size,
      name = _ref.name,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "currentColor" : _ref$color,
      _ref$role = _ref.role,
      role = _ref$role === void 0 ? "presentation" : _ref$role,
      _ref$focusable = _ref.focusable,
      focusable = _ref$focusable === void 0 ? false : _ref$focusable,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["size", "name", "color", "role", "focusable"]);

  var _useContext = (0, _react.useContext)(_core.ThemeContext),
      iconPaths = _useContext.icons; // Fallback in case you pass the wrong name


  var iconFallback = iconPaths["question-outline"];
  var path = iconPaths[name] == null ? iconFallback.path : iconPaths[name].path;
  var viewBox = (iconPaths[name] == null ? iconFallback.viewBox : iconPaths[name].viewBox) || "0 0 24 24";
  return (0, _core.jsx)(Svg, (0, _extends2["default"])({
    ref: ref,
    as: "svg",
    size: size,
    color: color,
    display: "inline-block",
    verticalAlign: "middle",
    viewBox: viewBox,
    focusable: focusable,
    role: role
  }, rest), path);
});
Icon.displayName = "Icon";
var _default = Icon;
exports["default"] = _default;