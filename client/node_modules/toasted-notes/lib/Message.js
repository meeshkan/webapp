import * as React from "react";
import { useTransition, animated } from "react-spring";
import ReachAlert from "@reach/alert";
import Alert from "./Alert";
import { useTimeout } from "./useTimeout";
const getStyle = (position) => {
    let style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    };
    if (position.includes("right")) {
        style.alignItems = "flex-end";
    }
    else if (position.includes("left")) {
        style.alignItems = "flex-start";
    }
    return style;
};
export const Message = ({ id, message, position, onRequestRemove, requestClose = false, duration = 30000 }) => {
    const container = React.useRef(null);
    const [timeout, setTimeout] = React.useState(duration);
    const [localShow, setLocalShow] = React.useState(true);
    const isFromTop = position === "top-left" || position === "top-right" || position === "top";
    useTimeout(close, timeout);
    const animation = {
        config: { mass: 1, tension: 185, friction: 26 },
        from: {
            opacity: 1,
            height: 0,
            transform: `translateY(${isFromTop ? "-100%" : 0}) scale(1)`
        },
        enter: () => (next) => next({
            opacity: 1,
            height: container.current.getBoundingClientRect().height,
            transform: `translateY(0) scale(1)`
        }),
        leave: {
            opacity: 0,
            height: 0,
            transform: `translateY(0 scale(0.9)`
        },
        onRest
    };
    const transition = useTransition(localShow, null, animation);
    const style = React.useMemo(() => getStyle(position), [position]);
    function onMouseEnter() {
        setTimeout(null);
    }
    function onMouseLeave() {
        setTimeout(duration);
    }
    function onRest() {
        if (!localShow) {
            onRequestRemove();
        }
    }
    function close() {
        setLocalShow(false);
    }
    React.useEffect(() => {
        if (requestClose) {
            setLocalShow(false);
        }
    }, [requestClose]);
    function renderMessage() {
        if (typeof message === "string" || React.isValidElement(message)) {
            return React.createElement(Alert, { id: id, title: message, onClose: close });
        }
        if (typeof message === "function") {
            return message({
                id,
                onClose: close
            });
        }
        return null;
    }
    return (React.createElement(React.Fragment, null, transition.map(({ key, item, props }) => item && (React.createElement(animated.div, { key: key, className: "Toaster__message", onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, style: Object.assign({ opacity: props.opacity, height: props.height }, style) },
        React.createElement(animated.div, { style: {
                transform: props.transform,
                pointerEvents: "auto"
            }, ref: container, className: "Toaster__message-wrapper" },
            React.createElement(ReachAlert, null, renderMessage())))))));
};
