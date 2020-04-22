import * as React from "react";
interface Props {
    id: string;
    title: React.ReactNode | string;
    onClose: () => void;
}
declare const Alert: ({ id, title, onClose }: Props) => JSX.Element;
export default Alert;
