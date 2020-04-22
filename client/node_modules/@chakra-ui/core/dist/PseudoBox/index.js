"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _css2 = _interopRequireDefault(require("@styled-system/css"));

var _Box = _interopRequireDefault(require("../Box"));

var _config = require("../Box/config");

/** @jsx jsx */

/**
 * The selectors are based on [WAI-ARIA state properties](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties) and common CSS Selectors
 */
var hover = "&:hover";
var active = "&:active, &[data-active=true]";
var focus = "&:focus";
var visited = "&:visited";
var even = "&:nth-of-type(even)";
var odd = "&:nth-of-type(odd)";
var disabled = "&:disabled, &:disabled:focus, &:disabled:hover, &[aria-disabled=true], &[aria-disabled=true]:focus, &[aria-disabled=true]:hover";
var checked = "&[aria-checked=true]";
var mixed = "&[aria-checked=mixed]";
var selected = "&[aria-selected=true]";
var invalid = "&[aria-invalid=true]";
var pressed = "&[aria-pressed=true]";
var readOnly = "&[aria-readonly=true], &[readonly]";
var first = "&:first-of-type";
var last = "&:last-of-type";
var expanded = "&[aria-expanded=true]";
var grabbed = "&[aria-grabbed=true]";
var notFirst = "&:not(:first-of-type)";
var notLast = "&:not(:last-of-type)";
var groupHover = "[role=group]:hover &";
var PseudoBox = (0, _styled["default"])(_Box["default"])(function (_ref) {
  var _css;

  var _after = _ref._after,
      _focus = _ref._focus,
      _selected = _ref._selected,
      _focusWithin = _ref._focusWithin,
      _hover = _ref._hover,
      _invalid = _ref._invalid,
      _active = _ref._active,
      _disabled = _ref._disabled,
      _grabbed = _ref._grabbed,
      _pressed = _ref._pressed,
      _expanded = _ref._expanded,
      _visited = _ref._visited,
      _before = _ref._before,
      _readOnly = _ref._readOnly,
      _first = _ref._first,
      _notFirst = _ref._notFirst,
      _notLast = _ref._notLast,
      _last = _ref._last,
      _placeholder = _ref._placeholder,
      _checked = _ref._checked,
      _groupHover = _ref._groupHover,
      _mixed = _ref._mixed,
      _odd = _ref._odd,
      _even = _ref._even;
  return (0, _css2["default"])((_css = {}, _css[hover] = (0, _config.transformAliasProps)(_hover), _css[focus] = (0, _config.transformAliasProps)(_focus), _css[active] = (0, _config.transformAliasProps)(_active), _css[visited] = (0, _config.transformAliasProps)(_visited), _css[disabled] = (0, _config.transformAliasProps)(_disabled), _css[selected] = (0, _config.transformAliasProps)(_selected), _css[invalid] = (0, _config.transformAliasProps)(_invalid), _css[expanded] = (0, _config.transformAliasProps)(_expanded), _css[grabbed] = (0, _config.transformAliasProps)(_grabbed), _css[readOnly] = (0, _config.transformAliasProps)(_readOnly), _css[first] = (0, _config.transformAliasProps)(_first), _css[notFirst] = (0, _config.transformAliasProps)(_notFirst), _css[notLast] = (0, _config.transformAliasProps)(_notLast), _css[last] = (0, _config.transformAliasProps)(_last), _css[odd] = (0, _config.transformAliasProps)(_odd), _css[even] = (0, _config.transformAliasProps)(_even), _css[mixed] = (0, _config.transformAliasProps)(_mixed), _css[checked] = (0, _config.transformAliasProps)(_checked), _css[pressed] = (0, _config.transformAliasProps)(_pressed), _css[groupHover] = (0, _config.transformAliasProps)(_groupHover), _css["&:before"] = (0, _config.transformAliasProps)(_before), _css["&:after"] = (0, _config.transformAliasProps)(_after), _css["&:focus-within"] = (0, _config.transformAliasProps)(_focusWithin), _css["&::placeholder"] = _placeholder, _css));
});
PseudoBox.displayName = "PseudoBox";
var _default = PseudoBox;
exports["default"] = _default;