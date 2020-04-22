/** @jsx jsx */
import styled from "@emotion/styled";
import css from "@styled-system/css";
import Box from "../Box";
import { transformAliasProps as tx } from "../Box/config";
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
var PseudoBox = styled(Box)(function (_ref) {
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
  return css((_css = {}, _css[hover] = tx(_hover), _css[focus] = tx(_focus), _css[active] = tx(_active), _css[visited] = tx(_visited), _css[disabled] = tx(_disabled), _css[selected] = tx(_selected), _css[invalid] = tx(_invalid), _css[expanded] = tx(_expanded), _css[grabbed] = tx(_grabbed), _css[readOnly] = tx(_readOnly), _css[first] = tx(_first), _css[notFirst] = tx(_notFirst), _css[notLast] = tx(_notLast), _css[last] = tx(_last), _css[odd] = tx(_odd), _css[even] = tx(_even), _css[mixed] = tx(_mixed), _css[checked] = tx(_checked), _css[pressed] = tx(_pressed), _css[groupHover] = tx(_groupHover), _css["&:before"] = tx(_before), _css["&:after"] = tx(_after), _css["&:focus-within"] = tx(_focusWithin), _css["&::placeholder"] = _placeholder, _css));
});
PseudoBox.displayName = "PseudoBox";
export default PseudoBox;