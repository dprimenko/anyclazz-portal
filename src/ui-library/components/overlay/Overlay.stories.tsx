import { Overlay } from "./Overlay";

const Example = () => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "1rem",
        }}
    >
        <Overlay>
            <div style={{color: "white", display: "grid", placeContent: "center", height: "100%", width: "100%"}}>
                <h1>Overlay</h1>
            </div>
        </Overlay>
    </div>
);

const meta = {
    title: "Common/Overlay",
    component: Example
};

export default meta;

export const Normal = {};