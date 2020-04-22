"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.ListIcon = exports.ListItem = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _utils = require("../utils");

/** @jsx jsx */
var List = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$styleType = _ref.styleType,
      styleType = _ref$styleType === void 0 ? "none" : _ref$styleType,
      _ref$stylePos = _ref.stylePos,
      stylePos = _ref$stylePos === void 0 ? "inside" : _ref$stylePos,
      spacing = _ref.spacing,
      children = _ref.children,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["styleType", "stylePos", "spacing", "children"]);
  var validChildren = (0, _utils.cleanChildren)(children);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    as: "ul",
    listStyleType: styleType,
    listStylePosition: stylePos
  }, props), validChildren.map(function (child, index) {
    var isLast = index + 1 === _react.Children.count(children);

    if (isLast) {
      return child;
    }

    return (0, _react.cloneElement)(child, {
      spacing: spacing
    });
  }));
});
List.displayName = "List";
var ListItem = (0, _react.forwardRef)(function (_ref2, ref) {
  var spacing = _ref2.spacing,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["spacing"]);
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    ref: ref,
    as: "li",
    mb: spacing
  }, props));
});
exports.ListItem = ListItem;
ListItem.diplayName = "ListItem";

var ListIcon = function ListIcon(_ref3) {
  var icon = _ref3.icon,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["icon"]);

  if (typeof icon === "string") {
    return (0, _core.jsx)(_Icon["default"], (0, _extends2["default"])({
      name: icon,
      mr: 2
    }, props));
  }

  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: icon,
    d: "inline",
    focusable: "false",
    size: "1em",
    color: "currentColor",
    mr: 2
  }, props));
};

exports.ListIcon = ListIcon;
var _default = List;
exports["default"] = _default;