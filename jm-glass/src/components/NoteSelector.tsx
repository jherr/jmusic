/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { SCALE_NOTES } from "jmusic-engine";

const NoteSelectorContainer = tw.div`rounded-full bg-gray-300 grid grid-cols-12`;
const PillBase = tw.button`py-2 inline-block text-gray-600 text-center`;
const Pill = styled(PillBase)<{ selected?: boolean }>(({ selected }) => [
  selected && tw`bg-gray-800 text-gray-200 rounded-full`,
]);

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
