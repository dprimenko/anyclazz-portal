import { Drawer } from "./Drawer.tsx";
import { DrawerProps } from "./types.ts";

const Example = ({ children, onClose }: DrawerProps) => (
    <div
        style={{
            height: "100dvh",
            width: "100dvw",
        }}
    >
        <Drawer onClose={onClose}>
            {children}
        </Drawer>
    </div>
);

const meta = {
    title: "Common/Drawer",
    component: Example
};

export default meta;

export const Normal = {
    args: {
        children: (
            <>
                <h1>Drawer</h1>
                <p>Drawer content</p>
            </>
        ),
        onClose: () => {
            console.log("close");
        },
    }
};