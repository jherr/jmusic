/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { CHORDS } from "jmusic-engine";

const ChordSelectorContainer = tw.div`rounded-md bg-gray-300 overflow-y-scroll max-h-96 sticky top-0`;
const ChordPillBase = tw.button`w-full py-1 px-3 text-xs text-gray-600`;
const ChordPill = styled(ChordPillBase)<{ selected?: boolean }>(
  ({ selected }) => [selected && tw`bg-gray-800 text-gray-200 rounded-l-md`]
);

const ChordSelector: React.FC<{
  index?: number;
  onChange?: (index: number) => void;
}> = ({ index, onChange }) => (
  <ChordSelectorContainer>
    {CHORDS.map(({ name }, cIndex) => (
      <ChordPill
        key={cIndex}
        selected={cIndex === index}
        onClick={() => onChange?.(cIndex)}
      >
        {name}
      </ChordPill>
    ))}
  </ChordSelectorContainer>
);

export default ChordSelector;
