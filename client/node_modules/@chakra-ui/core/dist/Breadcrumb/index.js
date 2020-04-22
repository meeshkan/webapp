"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.BreadcrumbSeparator = exports.BreadcrumbItem = exports.BreadcrumbLink = exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _Link = _interopRequireDefault(require("../Link"));

var _utils = require("../utils");

/** @jsx jsx */
var BreadcrumbSeparator = (0, _react.forwardRef)(function (_ref, ref) {
  var spacing = _ref.spacing,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["spacing"]);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    role: "presentation",
    as: "span",
    mx: spacing
  }, props));
});
exports.BreadcrumbSeparator = BreadcrumbSeparator;
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var Span = (0, _react.forwardRef)(function (props, ref) {
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    as: "span"
  }, props));
});
var BreadcrumbLink = (0, _react.forwardRef)(function (_ref2, ref) {
  var isCurrentPage = _ref2.isCurrentPage,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["isCurrentPage"]);
  var Comp = isCurrentPage ? Span : _Link["default"];
  return (0, _core.jsx)(Comp, (0, _extends2["default"])({
    ref: ref,
    "aria-current": isCurrentPage ? "page" : null
  }, props));
});
exports.BreadcrumbLink = BreadcrumbLink;
BreadcrumbLink.displayName = "BreadcrumbLink";

var BreadcrumbItem = function BreadcrumbItem(_ref3) {
  var isCurrentPage = _ref3.isCurrentPage,
      separator = _ref3.separator,
      isLastChild = _ref3.isLastChild,
      addSeparator = _ref3.addSeparator,
      spacing = _ref3.spacing,
      children = _ref3.children,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["isCurrentPage", "separator", "isLastChild", "addSeparator", "spacing", "children"]);
  var validChildren = (0, _utils.cleanChildren)(children);
  var clones = validChildren.map(function (child) {
    if (child.type === BreadcrumbLink) {
      return (0, _react.cloneElement)(child, {
        isCurrentPage: isCurrentPage
      });
    }

    if (child.type === BreadcrumbSeparator) {
      return (0, _react.cloneElement)(child, {
        spacing: spacing,
        children: child.props.children || separator
      });
    }

    return child;
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    display: "inline-flex",
    alignItems: "center",
    as: "li"
  }, rest), clones, !isLastChild && addSeparator && (0, _core.jsx)(BreadcrumbSeparator, {
    spacing: spacing,
    children: separator
  }));
};

exports.BreadcrumbItem = BreadcrumbItem;

var Breadcrumb = function Breadcrumb(_ref4) {
  var children = _ref4.children,
      _ref4$spacing = _ref4.spacing,
      spacing = _ref4$spacing === void 0 ? 2 : _ref4$spacing,
      _ref4$addSeparator = _ref4.addSeparator,
      addSeparator = _ref4$addSeparator === void 0 ? true : _ref4$addSeparator,
      _ref4$separator = _ref4.separator,
      separator = _ref4$separator === void 0 ? "/" : _ref4$separator,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref4, ["children", "spacing", "addSeparator", "separator"]);
  var validChildren = (0, _utils.cleanChildren)(children);
  var clones = validChildren.map(function (child, index) {
    return (0, _react.cloneElement)(child, {
      addSeparator: addSeparator,
      separator: separator,
      spacing: spacing,
      isLastChild: validChildren.length === index + 1
    });
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: "nav",
    "aria-label": "breadcrumb"
  }, rest), (0, _core.jsx)(_Box["default"], {
    as: "ol"
  }, clones));
};

var _default = Breadcrumb;
exports["default"] = _default;