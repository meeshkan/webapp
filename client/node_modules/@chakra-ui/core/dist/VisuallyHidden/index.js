"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _Box = _interopRequireDefault(require("../Box"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  border: 0px;\n  clip: rect(0px, 0px, 0px, 0px);\n  height: 1px;\n  width: 1px;\n  margin: -1px;\n  padding: 0px;\n  overflow: hidden;\n  white-space: nowrap;\n  position: absolute;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var VisuallyHidden = (0, _styled["default"])(_Box["default"])(_templateObject());
VisuallyHidden.displayName = "VisuallyHidden";
var _default = VisuallyHidden;
exports["default"] = _default;