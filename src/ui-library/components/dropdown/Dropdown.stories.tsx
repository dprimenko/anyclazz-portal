import { ChangeEvent, useCallback, useState } from "react";
import { Dropdown } from "./index.ts";
import { DropdownProps } from "./types.ts";

const Example = (props: DropdownProps) => {
    const [value, setValue] = useState<string | undefined>(props.value as string | undefined);

    const handleValueChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setValue(e.target.value);
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "200px",
            }}
        >
            <Dropdown {...props} value={value} onChange={handleValueChange}/>
        </div>
    );
};

const meta = {
    title: "Common/Dropdown",
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
        variant: "big",
        value: "weeks",
        items: [
            { value: "weeks", label: "Semanas" },
            { value: "months", label: "Meses"},
            { value: "years", label: "Años" },
        ],
        required: false,
        error: false,
        errorMessage: "Campo obligatorio",
        disabled: false
    },
};
