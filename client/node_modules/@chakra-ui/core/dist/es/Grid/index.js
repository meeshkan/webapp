import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import React, { forwardRef } from "react";
import Box from "../Box";
var Grid = forwardRef(function (_ref, ref) {
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
      props = _objectWithoutPropertiesLoose(_ref, ["gap", "rowGap", "columnGap", "autoFlow", "autoRows", "autoColumns", "templateRows", "templateColumns", "templateAreas", "area", "column", "row"]);

  return React.createElement(Box, _extends({
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
export default Grid;