import _css from "@styled-system/css";
import { transformAliasProps as tx } from "../Box/config";

var css = function css(styleProps) {
  return _css(tx(styleProps));
};

export default css;