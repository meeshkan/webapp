"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireWildcard(require("react"));

var _Grid = _interopRequireDefault(require("../Grid"));

var _utils = require("./utils");

var SimpleGrid = (0, _react.forwardRef)(function (_ref, ref) {
  var columns = _ref.columns,
      spacingX = _ref.spacingX,
      spacingY = _ref.spacingY,
      spacing = _ref.spacing,
      minChildWidth = _ref.minChildWidth,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["columns", "spacingX", "spacingY", "spacing", "minChildWidth"]);
  var templateColumns = !!minChildWidth ? (0, _utils.widthToColumns)(minChildWidth) : (0, _utils.countToColumns)(columns);
  return _react["default"].createElement(_Grid["default"], (0, _extends2["default"])({
    ref: ref,
    gap: spacing,
    columnGap: spacingX,
    rowGap: spacingY,
    templateColumns: templateColumns
  }, props));
});
SimpleGrid.displayName = "SimpleGrid";
var _default = SimpleGrid;
exports["default"] = _default;