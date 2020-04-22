import * as React from "react";
import POSITIONS from "./Positions";
interface MessageCallback {
    id: string;
    onClose: () => void;
}
export declare type MessageType = "default" | "success" | "error";
export declare type PositionsType = keyof typeof POSITIONS;
export declare type MessageProp = React.ReactNode | ((callback: MessageCallback) => React.ReactNode) | string;
export interface MessageOptions {
    id: string;
    duration: number | null;
    type: MessageType;
    onRequestRemove: () => void;
    onRequestClose: () => void;
    showing: boolean;
    position: PositionsType;
}
interface Props extends MessageOptions {
    message: MessageProp;
    zIndex?: number;
    requestClose?: boolean;
    position: PositionsType;
}
export declare const Message: ({ id, message, position, onRequestRemove, requestClose, duration }: Props) => JSX.Element;
export {};
