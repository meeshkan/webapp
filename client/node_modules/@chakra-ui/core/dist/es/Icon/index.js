import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  flex-shrink: 0;\n  backface-visibility: hidden;\n  &:not(:root) {\n    overflow: hidden;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

/** @jsx jsx */
import { jsx, ThemeContext } from "@emotion/core";
import styled from "@emotion/styled";
import { useContext, forwardRef } from "react";
import Box from "../Box";
var Svg = styled(Box)(_templateObject());
var Icon = forwardRef(function (_ref, ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "1em" : _ref$size,
      name = _ref.name,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "currentColor" : _ref$color,
      _ref$role = _ref.role,
      role = _ref$role === void 0 ? "presentation" : _ref$role,
      _ref$focusable = _ref.focusable,
      focusable = _ref$focusable === void 0 ? false : _ref$focusable,
      rest = _objectWithoutPropertiesLoose(_ref, ["size", "name", "color", "role", "focusable"]);

  var _useContext = useContext(ThemeContext),
      iconPaths = _useContext.icons; // Fallback in case you pass the wrong name


  var iconFallback = iconPaths["question-outline"];
  var path = iconPaths[name] == null ? iconFallback.path : iconPaths[name].path;
  var viewBox = (iconPaths[name] == null ? iconFallback.viewBox : iconPaths[name].viewBox) || "0 0 24 24";
  return jsx(Svg, _extends({
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
export default Icon;