import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Children, cloneElement, forwardRef } from "react";
import Box from "../Box";
import Icon from "../Icon";
import PseudoBox from "../PseudoBox";
import { cleanChildren } from "../utils";
var List = forwardRef(function (_ref, ref) {
  var _ref$styleType = _ref.styleType,
      styleType = _ref$styleType === void 0 ? "none" : _ref$styleType,
      _ref$stylePos = _ref.stylePos,
      stylePos = _ref$stylePos === void 0 ? "inside" : _ref$stylePos,
      spacing = _ref.spacing,
      children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["styleType", "stylePos", "spacing", "children"]);

  var validChildren = cleanChildren(children);
  return jsx(Box, _extends({
    ref: ref,
    as: "ul",
    listStyleType: styleType,
    listStylePosition: stylePos
  }, props), validChildren.map(function (child, index) {
    var isLast = index + 1 === Children.count(children);

    if (isLast) {
      return child;
    }

    return cloneElement(child, {
      spacing: spacing
    });
  }));
});
List.displayName = "List";
export var ListItem = forwardRef(function (_ref2, ref) {
  var spacing = _ref2.spacing,
      props = _objectWithoutPropertiesLoose(_ref2, ["spacing"]);

  return jsx(PseudoBox, _extends({
    ref: ref,
    as: "li",
    mb: spacing
  }, props));
});
ListItem.diplayName = "ListItem";
export var ListIcon = function ListIcon(_ref3) {
  var icon = _ref3.icon,
      props = _objectWithoutPropertiesLoose(_ref3, ["icon"]);

  if (typeof icon === "string") {
    return jsx(Icon, _extends({
      name: icon,
      mr: 2
    }, props));
  }

  return jsx(Box, _extends({
    as: icon,
    d: "inline",
    focusable: "false",
    size: "1em",
    color: "currentColor",
    mr: 2
  }, props));
};
export default List;