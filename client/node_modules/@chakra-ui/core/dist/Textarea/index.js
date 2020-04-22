"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ExpandingTextarea = exports["default"] = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@emotion/core");

var _react = require("react");

var _Input = _interopRequireDefault(require("../Input"));

/** @jsx jsx */
var Textarea = (0, _react.forwardRef)(function (props, ref) {
  return (0, _core.jsx)(_Input["default"], (0, _extends2["default"])({
    py: "8px",
    minHeight: "80px",
    lineHeight: "short",
    ref: ref,
    as: "textarea"
  }, props));
});
Textarea.displayName = "Textarea";
var _default = Textarea;
exports["default"] = _default;
var ExpandingTextarea = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$minHeight = _ref.minHeight,
      minHeight = _ref$minHeight === void 0 ? "39px" : _ref$minHeight,
      onInput = _ref.onInput,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["minHeight", "onInput"]);

  var _useState = (0, _react.useState)(0),
      height = _useState[0],
      setHeight = _useState[1];

  var ownRef = (0, _react.useRef)();
  var textareaRef = ref || ownRef;
  (0, _react.useLayoutEffect)(function () {
    if (textareaRef.current) {
      setHeight(textareaRef.current.scrollHeight);
    }
  }, [textareaRef]);

  var handleInput = function handleInput(event) {
    if (textareaRef.current) {
      setTimeout(function () {
        setHeight("auto");
        setHeight(textareaRef.current.scrollHeight);
      }, 0);
    }

    onInput && onInput(event);
  };

  return (0, _core.jsx)(Textarea, (0, _extends2["default"])({
    rows: "1",
    onInput: handleInput,
    css: {
      height: height,
      resize: "none",
      overflow: "hidden",
      minHeight: minHeight
    },
    ref: textareaRef
  }, props));
});
exports.ExpandingTextarea = ExpandingTextarea;
ExpandingTextarea.displayName = "ExpandingTextarea";