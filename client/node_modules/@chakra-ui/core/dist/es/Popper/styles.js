import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n    [x-arrow] {\n      width: ", ";\n      height: ", ";\n      position: absolute;\n      transform: rotate(45deg);\n\n      &::before {\n        content: \"\";\n        width: ", ";\n        height: ", ";\n        position: absolute;\n        z-index: -1;\n      }\n    }\n\n    &[x-placement^=\"top\"] {\n      margin-bottom: ", ";\n      transform-origin: bottom center;\n    }\n\n    &[x-placement^=\"top\"] [x-arrow] {\n      bottom: ", ";\n\n      &::before {\n        box-shadow: 2px 2px 2px 0 ", ";\n      }\n    }\n\n    &[x-placement^=\"bottom\"] {\n      margin-top: ", ";\n      transform-origin: top center;\n    }\n\n    &[x-placement^=\"bottom\"] [x-arrow] {\n      top: ", ";\n\n      &::before {\n        box-shadow: -1px -1px 1px 0 ", ";\n      }\n    }\n\n    &[x-placement^=\"right\"] {\n      margin-left: ", ";\n      transform-origin: left center;\n    }\n\n    &[x-placement^=\"right\"] [x-arrow] {\n      left: ", ";\n\n      &::before {\n        box-shadow: -1px 1px 1px 0 ", ";\n      }\n    }\n\n    &[x-placement^=\"left\"] {\n      margin-right: ", ";\n      transform-origin: right center;\n    }\n\n    &[x-placement^=\"left\"] [x-arrow] {\n      right: ", ";\n      &::before {\n        box-shadow: 1px -1px 1px 0 ", ";\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import { css } from "@emotion/core";

var getPopperArrowStyle = function getPopperArrowStyle(_ref) {
  var _ref$arrowSize = _ref.arrowSize,
      arrowSize = _ref$arrowSize === void 0 ? "1rem" : _ref$arrowSize,
      _ref$arrowShadowColor = _ref.arrowShadowColor,
      arrowShadowColor = _ref$arrowShadowColor === void 0 ? "rgba(0, 0, 0, 0.1)" : _ref$arrowShadowColor,
      _ref$hasArrow = _ref.hasArrow,
      hasArrow = _ref$hasArrow === void 0 ? true : _ref$hasArrow;
  var popoverMargin = hasArrow ? "calc(" + arrowSize + " / 2)" : null;
  var arrowPos = "calc(" + arrowSize + " / 2 * -1)";
  return css(_templateObject(), arrowSize, arrowSize, arrowSize, arrowSize, popoverMargin, arrowPos, arrowShadowColor, popoverMargin, arrowPos, arrowShadowColor, popoverMargin, arrowPos, arrowShadowColor, popoverMargin, arrowPos, arrowShadowColor);
};

export default getPopperArrowStyle;