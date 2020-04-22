import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { cloneElement } from "react";
import Box from "../Box";
import Input from "../Input";
import { inputSizes } from "../Input/styles";
import { InputLeftElement, InputRightElement } from "../InputElement";
import { useTheme } from "../ThemeProvider";
import { cleanChildren } from "../utils";

var InputGroup = function InputGroup(_ref) {
  var children = _ref.children,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      props = _objectWithoutPropertiesLoose(_ref, ["children", "size"]);

  var _useTheme = useTheme(),
      sizes = _useTheme.sizes;

  var height = inputSizes[size] && inputSizes[size]["height"];
  var pl = null;
  var pr = null;
  var validChildren = cleanChildren(children);
  return jsx(Box, _extends({
    display: "flex",
    position: "relative"
  }, props), validChildren.map(function (child) {
    if (child.type === InputLeftElement) {
      pl = sizes[height];
    }

    if (child.type === InputRightElement) {
      pr = sizes[height];
    }

    if (child.type === Input) {
      return cloneElement(child, {
        size: size,
        pl: child.props.pl || pl,
        pr: child.props.pr || pr
      });
    }

    return cloneElement(child, {
      size: size
    });
  }));
};

export default InputGroup;