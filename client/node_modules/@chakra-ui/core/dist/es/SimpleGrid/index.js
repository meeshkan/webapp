import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import React, { forwardRef } from "react";
import Grid from "../Grid";
import { countToColumns, widthToColumns } from "./utils";
var SimpleGrid = forwardRef(function (_ref, ref) {
  var columns = _ref.columns,
      spacingX = _ref.spacingX,
      spacingY = _ref.spacingY,
      spacing = _ref.spacing,
      minChildWidth = _ref.minChildWidth,
      props = _objectWithoutPropertiesLoose(_ref, ["columns", "spacingX", "spacingY", "spacing", "minChildWidth"]);

  var templateColumns = !!minChildWidth ? widthToColumns(minChildWidth) : countToColumns(columns);
  return React.createElement(Grid, _extends({
    ref: ref,
    gap: spacing,
    columnGap: spacingX,
    rowGap: spacingY,
    templateColumns: templateColumns
  }, props));
});
SimpleGrid.displayName = "SimpleGrid";
export default SimpleGrid;