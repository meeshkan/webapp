import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { statuses } from "../Alert";
import useAlertStyle from "../Alert/styles";
import Box from "../Box";

var Callout = function Callout(_ref) {
  var _ref$status = _ref.status,
      status = _ref$status === void 0 ? "info" : _ref$status,
      _ref$variant = _ref.variant,
      variant = _ref$variant === void 0 ? "subtle" : _ref$variant,
      rest = _objectWithoutPropertiesLoose(_ref, ["status", "variant"]);

  var alertStyleProps = useAlertStyle({
    variant: variant,
    color: statuses[status] && statuses[status]["color"]
  });
  return jsx(Box, _extends({}, alertStyleProps, rest));
};

export default Callout;