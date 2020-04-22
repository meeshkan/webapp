import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { cloneElement, forwardRef } from "react";
import Box from "../Box";
import Link from "../Link";
import { cleanChildren } from "../utils";
var BreadcrumbSeparator = forwardRef(function (_ref, ref) {
  var spacing = _ref.spacing,
      props = _objectWithoutPropertiesLoose(_ref, ["spacing"]);

  return jsx(Box, _extends({
    ref: ref,
    role: "presentation",
    as: "span",
    mx: spacing
  }, props));
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var Span = forwardRef(function (props, ref) {
  return jsx(Box, _extends({
    ref: ref,
    as: "span"
  }, props));
});
var BreadcrumbLink = forwardRef(function (_ref2, ref) {
  var isCurrentPage = _ref2.isCurrentPage,
      props = _objectWithoutPropertiesLoose(_ref2, ["isCurrentPage"]);

  var Comp = isCurrentPage ? Span : Link;
  return jsx(Comp, _extends({
    ref: ref,
    "aria-current": isCurrentPage ? "page" : null
  }, props));
});
BreadcrumbLink.displayName = "BreadcrumbLink";

var BreadcrumbItem = function BreadcrumbItem(_ref3) {
  var isCurrentPage = _ref3.isCurrentPage,
      separator = _ref3.separator,
      isLastChild = _ref3.isLastChild,
      addSeparator = _ref3.addSeparator,
      spacing = _ref3.spacing,
      children = _ref3.children,
      rest = _objectWithoutPropertiesLoose(_ref3, ["isCurrentPage", "separator", "isLastChild", "addSeparator", "spacing", "children"]);

  var validChildren = cleanChildren(children);
  var clones = validChildren.map(function (child) {
    if (child.type === BreadcrumbLink) {
      return cloneElement(child, {
        isCurrentPage: isCurrentPage
      });
    }

    if (child.type === BreadcrumbSeparator) {
      return cloneElement(child, {
        spacing: spacing,
        children: child.props.children || separator
      });
    }

    return child;
  });
  return jsx(Box, _extends({
    display: "inline-flex",
    alignItems: "center",
    as: "li"
  }, rest), clones, !isLastChild && addSeparator && jsx(BreadcrumbSeparator, {
    spacing: spacing,
    children: separator
  }));
};

var Breadcrumb = function Breadcrumb(_ref4) {
  var children = _ref4.children,
      _ref4$spacing = _ref4.spacing,
      spacing = _ref4$spacing === void 0 ? 2 : _ref4$spacing,
      _ref4$addSeparator = _ref4.addSeparator,
      addSeparator = _ref4$addSeparator === void 0 ? true : _ref4$addSeparator,
      _ref4$separator = _ref4.separator,
      separator = _ref4$separator === void 0 ? "/" : _ref4$separator,
      rest = _objectWithoutPropertiesLoose(_ref4, ["children", "spacing", "addSeparator", "separator"]);

  var validChildren = cleanChildren(children);
  var clones = validChildren.map(function (child, index) {
    return cloneElement(child, {
      addSeparator: addSeparator,
      separator: separator,
      spacing: spacing,
      isLastChild: validChildren.length === index + 1
    });
  });
  return jsx(Box, _extends({
    as: "nav",
    "aria-label": "breadcrumb"
  }, rest), jsx(Box, {
    as: "ol"
  }, clones));
};

export default Breadcrumb;
export { BreadcrumbLink, BreadcrumbItem, BreadcrumbSeparator };