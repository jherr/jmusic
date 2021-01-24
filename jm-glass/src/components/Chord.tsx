/** @jsxImportSource @emotion/react */
import React from "react";
import { StringedInstrument } from "@engine/strings";
import { Container, Inversion } from "@design/Theme";
import ChordSVG from "./ChordSVG";

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
