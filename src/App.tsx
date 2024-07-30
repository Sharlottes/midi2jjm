import { useState } from "react";
import { Container, Heading, TextField, TextArea, Flex, Button, Box } from "@radix-ui/themes";
import DropZone from "./DropZone";
import { motion } from "framer-motion";
import ColorInput from "./ColorInput";
import JSZip from "jszip";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<JJMData | undefined>();
  const [image, setImage] = useState<File | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as JJMData;
    console.log(data);
    data.channelHidden = Array.from({ length: 16 }, () => false) as JJMData["channelHidden"];
    data.channelSuggestedInstrument = Array.from({ length: 16 }, () => 0) as JJMData["channelSuggestedInstrument"];
    data.channelSuggestedInstrument[9] = 0b0010;
    data.targetAccuracy = [1, 1, 1, 1];
    data.midiFileName = file!.name;
    data.revision = 2;
    setData(data);
  };
  const handleSubmit = () => {
    if (!file || !data || !image) return;

    const zip = new JSZip();
    zip.file(file.name, file);
    zip.file("song.json", encodeUTF16LE(JSON.stringify(data)));
    zip.file("cover." + image.name.split(".").at(-1), image, { base64: true });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.cssText = "display: none";
      a.href = url;
      a.download = data.displayName + ".jjm";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  };

  return (
    <Container mt="4" size="2">
      <Heading align="center" mb="2">
        MIDI to JJM
      </Heading>
      <DropZone exts={[".mid", ".midi"]} handleFile={(f) => setFile(f)} label="drop a midi file here or " />
      {file && (
        <Box asChild mt="4">
          <motion.form initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} onChange={handleFormChange}>
            <Flex direction="column" gap="2">
              <TextField.Root placeholder="Display Name" name="displayName" required />
              <Flex gap="2">
                <TextField.Root placeholder="Song Author" name="songAuthor" style={{ flex: 1 }} required />
                <TextField.Root placeholder="MIDI Arragner" name="midiAuthor" style={{ flex: 1 }} required />
              </Flex>
              <Flex gap="2">
                <TextField.Root placeholder="Release Year" name="releaseYear" style={{ flex: 1 }} required />
                <TextField.Root placeholder="Genre" name="genre" style={{ flex: 1 }} required />
                <TextField.Root
                  placeholder="Difficulty"
                  name="difficulty"
                  type="number"
                  defaultValue="2"
                  style={{ flex: 1 }}
                  required
                />
              </Flex>
              <TextArea placeholder="Description" name="description" required />
              <Flex gap="2">
                <ColorInput
                  placeholder="cover color 1"
                  name="coverColor1"
                  defaultValue="#000000"
                  style={{ flex: 1 }}
                  required
                />
                <ColorInput
                  placeholder="cover color 2"
                  name="coverColor2"
                  defaultValue="#000000"
                  style={{ flex: 1 }}
                  required
                />
              </Flex>
            </Flex>
          </motion.form>
        </Box>
      )}
      {data && Object.values(data).every((data) => !!data) && (
        <Box asChild mt="4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
            <DropZone exts={[".jpg", ".png"]} handleFile={(i) => setImage(i)} label="drop a cover image file or " />
          </motion.div>
        </Box>
      )}
      {image && (
        <Box asChild mt="4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
            <Button style={{ width: "100%" }} size="4" onClick={handleSubmit}>
              Submit
            </Button>
          </motion.div>
        </Box>
      )}
    </Container>
  );
}

export default App;

// thanks so much - https://stackoverflow.com/a/24391376/24182996
function encodeUTF16LE(str: string) {
  let out, i, c;
  let char2, char3;

  out = "";
  const len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        out += str.charAt(i - 1);
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
        break;
    }
  }

  const byteArray = new Uint8Array(out.length * 2);
  for (let i = 0; i < out.length; i++) {
    byteArray[i * 2] = out.charCodeAt(i); // & 0xff;
    byteArray[i * 2 + 1] = out.charCodeAt(i) >> 8; // & 0xff;
  }

  return String.fromCharCode(...byteArray);
}
