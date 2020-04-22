"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

function usePrevious(value) {
  var ref = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    ref.current = value;
  }, [value]);
  return ref.current;
}

var _default = usePrevious;
exports["default"] = _default;