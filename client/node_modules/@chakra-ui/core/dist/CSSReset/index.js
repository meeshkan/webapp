"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _core = require("@emotion/core");

var _ColorModeProvider = require("../ColorModeProvider");

var _preflight = _interopRequireDefault(require("./preflight"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n      html {\n        line-height: 1.5;\n        color: ", ";\n        background-color: ", ";\n      }\n\n      /**\n      * Allow adding a border to an element by just adding a border-width.\n      */\n\n      *,\n      *::before,\n      *::after {\n        border-width: 0;\n        border-style: solid;\n        border-color: ", ";\n      }\n\n      input:-ms-input-placeholder,\n      textarea:-ms-input-placeholder {\n        color: ", ";\n      }\n\n      input::-ms-input-placeholder,\n      textarea::-ms-input-placeholder {\n        color: ", ";\n      }\n\n      input::placeholder,\n      textarea::placeholder {\n        color: ", ";\n      }\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var defaultConfig = function defaultConfig(theme) {
  return {
    light: {
      color: theme.colors.gray[800],
      bg: undefined,
      borderColor: theme.colors.gray[200],
      placeholderColor: theme.colors.gray[400]
    },
    dark: {
      color: theme.colors.whiteAlpha[900],
      bg: theme.colors.gray[800],
      borderColor: theme.colors.whiteAlpha[300],
      placeholderColor: theme.colors.whiteAlpha[400]
    }
  };
};

var CSSReset = function CSSReset(_ref) {
  var config = _ref.config;

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var configCSS = function configCSS(theme) {
    var _defaultConfig = defaultConfig(theme);

    var _config = config ? config(theme, _defaultConfig) : defaultConfig(theme);

    var _config$colorMode = _config[colorMode],
        color = _config$colorMode.color,
        bg = _config$colorMode.bg,
        borderColor = _config$colorMode.borderColor,
        placeholderColor = _config$colorMode.placeholderColor;
    return (0, _core.css)(_templateObject(), color, bg, borderColor, placeholderColor, placeholderColor, placeholderColor);
  };

  return (0, _core.jsx)(_core.Global, {
    styles: function styles(theme) {
      return (0, _core.css)([(0, _preflight["default"])(theme), configCSS(theme)]);
    }
  });
};

var _default = CSSReset;
exports["default"] = _default;