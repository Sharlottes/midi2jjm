import { TextField } from "@radix-ui/themes";
import { useState } from "react";

export interface ColorInputProps extends React.ComponentProps<typeof TextField.Root> {
  value?: string;
}
export default function ColorInput({ value: valueProp, ...props }: ColorInputProps) {
  const [value, setValue] = useState(valueProp);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <TextField.Root {...props} value={value}>
      <TextField.Slot style={{ position: "relative" }}>
        <label>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "5px",
              backgroundColor: value,
              boxShadow: `0 0 0 1px ${value}`,
              cursor: "pointer",
            }}
          />
          <input
            type="color"
            onChange={handleChange}
            value={value}
            defaultValue={value}
            style={{ position: "absolute", visibility: "hidden", inset: 0 }}
          />
        </label>
      </TextField.Slot>
    </TextField.Root>
  );
}
