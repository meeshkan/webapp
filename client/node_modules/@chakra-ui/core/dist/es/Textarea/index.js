import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import Input from "../Input";
var Textarea = forwardRef(function (props, ref) {
  return jsx(Input, _extends({
    py: "8px",
    minHeight: "80px",
    lineHeight: "short",
    ref: ref,
    as: "textarea"
  }, props));
});
Textarea.displayName = "Textarea";
export default Textarea;
export var ExpandingTextarea = forwardRef(function (_ref, ref) {
  var _ref$minHeight = _ref.minHeight,
      minHeight = _ref$minHeight === void 0 ? "39px" : _ref$minHeight,
      onInput = _ref.onInput,
      props = _objectWithoutPropertiesLoose(_ref, ["minHeight", "onInput"]);

  var _useState = useState(0),
      height = _useState[0],
      setHeight = _useState[1];

  var ownRef = useRef();
  var textareaRef = ref || ownRef;
  useLayoutEffect(function () {
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

  return jsx(Textarea, _extends({
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
ExpandingTextarea.displayName = "ExpandingTextarea";