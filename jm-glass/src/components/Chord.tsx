/** @jsxImportSource @emotion/react */
import React from "react";
import tw from "twin.macro";
import { StringedInstrument } from "../../../engine/src/strings";

import ChordSVG from "./ChordSVG";

const Container = tw.div`bg-gray-200 bg-opacity-40 rounded-md`;
const Inversion = tw.div`bg-white bg-opacity-40 rounded-b-md text-xs p-2 text-gray-700`;

const INVERSION_NAMES = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];

const Chord: React.FC<{
  chord: {
    notes: number[];
    playability: number;
    inversion: number;
  };
  instrument: StringedInstrument;
}> = ({ chord, instrument }) => (
  <Container className="chord-card">
    <ChordSVG chord={chord} instrument={instrument} />
    <Inversion>{INVERSION_NAMES[chord.inversion]} Inversion</Inversion>
  </Container>
);

export default Chord;
