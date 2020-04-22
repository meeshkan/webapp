/** @jsx jsx */
import styled from "@emotion/styled";
import { createShouldForwardProp, props } from "@styled-system/should-forward-prop";
import { background, border, color, flexbox, grid, layout, position, shadow, space, typography, compose } from "styled-system";
import extraConfig from "./config";
export var truncate = function truncate(props) {
  if (props.isTruncated) {
    return {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
  }
};
export var systemProps = compose(layout, color, space, background, border, grid, position, shadow, typography, flexbox, extraConfig);

var _shouldForwardProp = createShouldForwardProp([].concat(props, ["d", "textDecoration", "pointerEvents", "visibility", "transform", "cursor", "fill", "stroke"]));
/**
 * htmlWidth and htmlHeight is used in the <Image />
 * component to support the native `width` and `height` attributes
 *
 * https://github.com/chakra-ui/chakra-ui/issues/149
 */


var nativeHTMLPropAlias = ["htmlWidth", "htmlHeight"];
var Box = styled("div", {
  shouldForwardProp: function shouldForwardProp(prop) {
    if (nativeHTMLPropAlias.includes(prop)) {
      return true;
    } else {
      return _shouldForwardProp(prop);
    }
  }
})(truncate, systemProps);
Box.displayName = "Box";
export default Box;