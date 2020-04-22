import * as React from "react";
const Alert = ({ id, title, onClose }) => {
    return (React.createElement("div", { id: id, className: "Toaster__alert" },
        typeof title === "string" ? (React.createElement("div", { className: "Toaster__alert_text" }, title)) : (title),
        onClose && React.createElement(Close, { onClose: onClose })));
};
const Close = ({ onClose }) => (React.createElement("button", { className: "Toaster__alert_close", type: "button", "aria-label": "Close", onClick: onClose },
    React.createElement("span", { "aria-hidden": "true" }, "\u00D7")));
export default Alert;
