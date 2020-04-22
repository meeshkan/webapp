"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _css2 = _interopRequireDefault(require("@styled-system/css"));

var _Box = _interopRequireDefault(require("../Box"));

var _config = require("../Box/config");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ControlBox = (0, _styled["default"])(_Box["default"])(function (_ref) {
  var _css;

  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? "checkbox" : _ref$type,
      _hover = _ref._hover,
      _invalid = _ref._invalid,
      _disabled = _ref._disabled,
      _focus = _ref._focus,
      _checked = _ref._checked,
      _ref$_child = _ref._child,
      _child = _ref$_child === void 0 ? {
    opacity: 0
  } : _ref$_child,
      _ref$_checkedAndChild = _ref._checkedAndChild,
      _checkedAndChild = _ref$_checkedAndChild === void 0 ? {
    opacity: 1
  } : _ref$_checkedAndChild,
      _checkedAndDisabled = _ref._checkedAndDisabled,
      _checkedAndFocus = _ref._checkedAndFocus,
      _checkedAndHover = _ref._checkedAndHover;

  var checkedAndDisabled = "input[type=" + type + "]:checked:disabled + &, input[type=" + type + "][aria-checked=mixed]:disabled + &",
      checkedAndHover = "input[type=" + type + "]:checked:hover:not(:disabled) + &, input[type=" + type + "][aria-checked=mixed]:hover:not(:disabled) + &",
      checkedAndFocus = "input[type=" + type + "]:checked:focus + &, input[type=" + type + "][aria-checked=mixed]:focus + &",
      disabled = "input[type=" + type + "]:disabled + &",
      focus = "input[type=" + type + "]:focus + &",
      hover = "input[type=" + type + "]:hover:not(:disabled):not(:checked) + &",
      checked = "input[type=" + type + "]:checked + &, input[type=" + type + "][aria-checked=mixed] + &",
      invalid = "input[type=" + type + "][aria-invalid=true] + &";
  return (0, _css2["default"])((_css = {}, _css[focus] = (0, _config.transformAliasProps)(_focus), _css[hover] = (0, _config.transformAliasProps)(_hover), _css[disabled] = (0, _config.transformAliasProps)(_disabled), _css[invalid] = (0, _config.transformAliasProps)(_invalid), _css[checkedAndDisabled] = (0, _config.transformAliasProps)(_checkedAndDisabled), _css[checkedAndFocus] = (0, _config.transformAliasProps)(_checkedAndFocus), _css[checkedAndHover] = (0, _config.transformAliasProps)(_checkedAndHover), _css["& > *"] = (0, _config.transformAliasProps)(_child), _css[checked] = _objectSpread({}, (0, _config.transformAliasProps)(_checked), {
    "& > *": (0, _config.transformAliasProps)(_checkedAndChild)
  }), _css));
});
ControlBox.displayName = "ControlBox";
ControlBox.defaultProps = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 120ms",
  flexShrink: "0",
  "aria-hidden": "true"
};
var _default = ControlBox;
exports["default"] = _default;