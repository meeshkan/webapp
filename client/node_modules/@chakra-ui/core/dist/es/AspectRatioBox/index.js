import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Children, cloneElement } from "react";
import PseudoBox from "../PseudoBox";

var AspectRatioBox = function AspectRatioBox(_ref) {
  var _ref$ratio = _ref.ratio,
      ratio = _ref$ratio === void 0 ? 4 / 3 : _ref$ratio,
      children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["ratio", "children"]);

  var child = Children.only(children);
  return jsx(PseudoBox, _extends({
    pos: "relative",
    _before: {
      h: 0,
      content: "\"\"",
      d: "block",
      pb: 1 / ratio * 100 + "%"
    }
  }, props), cloneElement(child, {
    pos: "absolute",
    w: "full",
    h: "full",
    top: 0,
    left: 0
  }));
};

export default AspectRatioBox;