import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import useAvatarStyle, { avatarSizes } from "./styles";
import { useHasImageLoaded } from "../Image";
import { useTheme } from "../ThemeProvider";
import { useColorMode } from "../ColorModeProvider";
import Box from "../Box";
export var AvatarBadge = function AvatarBadge(props) {
  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var borderColor = {
    light: "white",
    dark: "gray.800"
  };
  return jsx(Box, _extends({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translate(25%, 25%)",
    bottom: "0",
    right: "0",
    border: "0.2em solid",
    borderColor: borderColor[colorMode],
    rounded: "full"
  }, props));
};

var getInitials = function getInitials(name) {
  var _name$split = name.split(" "),
      firstName = _name$split[0],
      lastName = _name$split[1];

  if (firstName && lastName) {
    return "" + firstName.charAt(0) + lastName.charAt(0);
  } else {
    return firstName.charAt(0);
  }
};

var AvatarName = function AvatarName(_ref) {
  var name = _ref.name,
      props = _objectWithoutPropertiesLoose(_ref, ["name"]);

  return jsx(Box, _extends({
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "medium",
    "aria-label": name
  }, props), name ? getInitials(name) : null);
};

var DefaultAvatar = function DefaultAvatar(props) {
  return jsx(Box, _extends({
    size: "100%"
  }, props), jsx("svg", {
    fill: "#fff",
    viewBox: "0 0 128 128",
    role: "img"
  }, jsx("g", null, jsx("path", {
    d: "M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
  }), jsx("path", {
    d: "M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
  }))));
};

var Avatar = function Avatar(_ref2) {
  var size = _ref2.size,
      showBorder = _ref2.showBorder,
      name = _ref2.name,
      src = _ref2.src,
      borderColor = _ref2.borderColor,
      children = _ref2.children,
      rest = _objectWithoutPropertiesLoose(_ref2, ["size", "showBorder", "name", "src", "borderColor", "children"]);

  var avatarStyleProps = useAvatarStyle({
    name: name,
    size: size,
    showBorder: showBorder,
    borderColor: borderColor
  });
  var hasLoaded = useHasImageLoaded({
    src: src
  });
  var theme = useTheme();
  var sizeKey = avatarSizes[size];
  var _size = theme.sizes[sizeKey];
  var fontSize = "calc(" + _size + " / 2.5)";

  var renderChildren = function renderChildren() {
    if (src && hasLoaded) {
      return jsx(Box, {
        as: "img",
        size: "100%",
        rounded: "full",
        objectFit: "cover",
        src: src,
        alt: name
      });
    }

    if (src && !hasLoaded) {
      if (name) {
        return jsx(AvatarName, {
          size: _size,
          name: name
        });
      } else {
        return jsx(DefaultAvatar, {
          "aria-label": name
        });
      }
    }

    if (!src && name) {
      return jsx(AvatarName, {
        size: _size,
        name: name
      });
    }

    return jsx(DefaultAvatar, {
      "aria-label": name
    });
  };

  return jsx(Box, _extends({
    fontSize: fontSize,
    lineHeight: _size,
    verticalAlign: "top"
  }, avatarStyleProps, rest), renderChildren(), children);
};

Avatar.defaultProps = {
  size: "md"
};
export default Avatar;