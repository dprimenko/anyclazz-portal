import { Button } from "../button/Button.tsx";
import { Modal } from "./Modal.tsx";
import { ModalProps } from "./types.ts";

const Example = ({ children, title, onClose, actions }: ModalProps) => (
    <div
        style={{
            height: "100dvh",
            width: "100dvw",
        }}
    >
        <Modal title={title} onClose={onClose} actions={actions}>
            {children}
        </Modal>
    </div>
);

const meta = {
    title: "Common/Modal",
    component: Example
};

export default meta;

export const Normal = {
    args: {
        title: "Eliminar informe",
        children: "¿Quieres eliminar el informe? Esta acción es permanente y el informe se eliminará de forma definitiva.",
        onClose: () => {
            console.log("close");
        },
        actions: (
            <>
                <Button variant="secondary" label="Cancelar" fullWidth/>
                <Button variant="primary" label="Eliminar informe" fullWidth/>
            </>
        )
    }
};