import { PropsWithChildren } from "react";

type ModalProps = {
    show: boolean;
    onClose: () => void;
};

export default function Modal({ show, onClose, children }: PropsWithChildren<ModalProps>) {
    return (
        <div
            onClick={onClose}
            className={
                "fixed inset-0 flex items-center justify-center bg-purple-dark bg-opacity-75" +
                " transition-opacity duration-300 ease-quart-out" +
                (show ? " z-[100] opacity-100 visible" : " -z-10 opacity-0 invisible")
            }
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[80vw] max-w-[638px] bg-white rounded-md shadow-lg"
            >
                {children}
            </div>
        </div>
    );
}
