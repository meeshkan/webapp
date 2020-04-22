"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireWildcard(require("react"));

var _Box = _interopRequireDefault(require("../Box"));

var Grid = (0, _react.forwardRef)(function (_ref, ref) {
  var gap = _ref.gap,
      rowGap = _ref.rowGap,
      columnGap = _ref.columnGap,
      autoFlow = _ref.autoFlow,
      autoRows = _ref.autoRows,
      autoColumns = _ref.autoColumns,
      templateRows = _ref.templateRows,
      templateColumns = _ref.templateColumns,
      templateAreas = _ref.templateAreas,
      area = _ref.area,
      column = _ref.column,
      row = _ref.row,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["gap", "rowGap", "columnGap", "autoFlow", "autoRows", "autoColumns", "templateRows", "templateColumns", "templateAreas", "area", "column", "row"]);
  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    display: "grid",
    gridArea: area,
    gridTemplateAreas: templateAreas,
    gridGap: gap,
    gridRowGap: rowGap,
    gridColumnGap: columnGap,
    gridAutoColumns: autoColumns,
    gridColumn: column,
    gridRow: row,
    gridAutoFlow: autoFlow,
    gridAutoRows: autoRows,
    gridTemplateRows: templateRows,
    gridTemplateColumns: templateColumns
  }, props));
});
Grid.displayName = "Grid";
var _default = Grid;
exports["default"] = _default;