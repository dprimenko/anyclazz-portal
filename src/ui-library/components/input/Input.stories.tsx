import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { Input } from "./";
import type { InputProps } from "./types.ts";

const Example = (props: InputProps) => {
    const [value, setValue] = useState<string | undefined>(props.value as string | undefined);

    const handleValueChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
            }}
        >
            <Input {...props} value={value} onChange={handleValueChange}/>
        </div>
    );
};

const meta = {
    title: "Common/Input",
    component: Example,
    argTypes: {
        variant: {
            control: {type: 'select'},
            options: ['big', 'small'],
        },
        label: {
            control: {type: 'text'},
        },
        disabled: {
            control: {type: 'boolean'},
        }
    }
};

export default meta;

export const Normal = {
    args: {
        label: "Introduce tu nombre",
        value: "",
        variant: 'big',
        required: false,
        readOnly: false,
        error: false,
        type: "text",
        errorMessage: "Campo obligatorio",
        disabled: false
    },
};
