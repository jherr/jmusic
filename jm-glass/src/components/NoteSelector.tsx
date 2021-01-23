/** @jsxImportSource @emotion/react */
import { SCALE_NOTES } from "jmusic-engine";
import React from "react";
import { NoteSelectorContainer, Pill } from "../design/Theme";

const NoteSelector: React.FC<{
  note?: number;
  onChange?: (note: number) => void;
}> = ({ note, onChange }) => (
  <NoteSelectorContainer>
    {SCALE_NOTES.map((name, index) => (
      <Pill
        key={name}
        selected={note === index}
        onClick={() => onChange?.(index)}
      >
        {name}
      </Pill>
    ))}
  </NoteSelectorContainer>
);

export default NoteSelector;
