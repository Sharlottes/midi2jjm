import { Button, Flex, Strong, Text } from "@radix-ui/themes";
import * as styles from "./DropZone.css";
import { useRef, useState } from "react";

export interface DropZoneProps {
  exts: string[];
  handleFile: (file: File) => void;
  label: string;
}
export default function DropZone({ exts, handleFile: handleFileProp, label }: DropZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File | null | undefined) => {
    if (!file || !exts.some((ext) => file.name.endsWith(ext))) return;
    setFile(file);
    handleFileProp(file);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    // it should have one file
    const file = e.dataTransfer.items ? e.dataTransfer.items[0].getAsFile() : e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => {
    inputRef.current!.click();
  };

  return (
    <div className={styles.dropZone} onDrop={handleDrop} onClick={handleClick} onDragOver={(e) => e.preventDefault()}>
      <Flex justify="center" align="center" gap="3">
        <Text>{label}</Text>
        <Button onClick={handleClick} variant="ghost" style={{ padding: 0 }}>
          choose a file
        </Button>
      </Flex>
      {file && <Strong>{file.name}</Strong>}
      <input
        ref={inputRef}
        type="file"
        accept={exts.join(",")}
        onChange={(e) => handleFile(e.target.files!.item(0))}
        style={{ display: "none" }}
      />
    </div>
  );
}
