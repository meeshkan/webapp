"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.systemProps = exports.truncate = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _shouldForwardProp2 = require("@styled-system/should-forward-prop");

var _styledSystem = require("styled-system");

var _config = _interopRequireDefault(require("./config"));

/** @jsx jsx */
var truncate = function truncate(props) {
  if (props.isTruncated) {
    return {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
  }
};

exports.truncate = truncate;
var systemProps = (0, _styledSystem.compose)(_styledSystem.layout, _styledSystem.color, _styledSystem.space, _styledSystem.background, _styledSystem.border, _styledSystem.grid, _styledSystem.position, _styledSystem.shadow, _styledSystem.typography, _styledSystem.flexbox, _config["default"]);
exports.systemProps = systemProps;

var _shouldForwardProp = (0, _shouldForwardProp2.createShouldForwardProp)([].concat(_shouldForwardProp2.props, ["d", "textDecoration", "pointerEvents", "visibility", "transform", "cursor", "fill", "stroke"]));
/**
 * htmlWidth and htmlHeight is used in the <Image />
 * component to support the native `width` and `height` attributes
 *
 * https://github.com/chakra-ui/chakra-ui/issues/149
 */


var nativeHTMLPropAlias = ["htmlWidth", "htmlHeight"];
var Box = (0, _styled["default"])("div", {
  shouldForwardProp: function shouldForwardProp(prop) {
    if (nativeHTMLPropAlias.includes(prop)) {
      return true;
    } else {
      return _shouldForwardProp(prop);
    }
  }
})(truncate, systemProps);
Box.displayName = "Box";
var _default = Box;
exports["default"] = _default;