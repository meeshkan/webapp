"use strict";

exports.__esModule = true;
exports.isNumberKey = isNumberKey;
exports.preventNonNumberKey = preventNonNumberKey;
exports.roundToPrecision = roundToPrecision;
exports.calculatePrecision = calculatePrecision;

function isNumberKey(event) {
  var charCode = event.which ? event.which : event.keyCode;
  if (event.key === ".") return true;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105) && charCode !== 110) return false;
  return true;
}

function preventNonNumberKey(event) {
  if (!isNumberKey(event)) {
    event.preventDefault();
  }
}

function roundToPrecision(value, precision) {
  return parseFloat(value).toFixed(precision);
}

function calculatePrecision(value) {
  var groups = /[1-9]([0]+$)|\.([0-9]*)/.exec(String(value));

  if (!groups) {
    return 0;
  }

  if (groups[1]) {
    return -groups[1].length;
  }

  if (groups[2]) {
    return groups[2].length;
  }

  return 0;
}