import React from "react";
import { StringedInstrument } from "@engine/strings";

const BALLS: {
  [fret: number]: number;
} = { 3: 1, 5: 1, 7: 1, 9: 1, 12: 2, 15: 1, 17: 1, 19: 1 };
const WIDTHS = [3, 3, 2, 2, 1, 1];
const FRETS = [0, 1, 2, 3, 4, 5];

const ChordSVG: React.FC<{
  chord: {
    notes: number[];
    playability: number;
    inversion: number;
  };
  instrument: StringedInstrument;
}> = ({ chord, instrument }) => {
  const minFret = Math.min(...chord.notes.filter((n) => n !== -1));

  return (
    <svg
      style={{
        minHeight: 260,
        maxHeight: 260,
        width: "100%",
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 160"
    >
      {minFret !== 0 && (
        <text
          x={(instrument.topNames.length - 1) * 15 + 15}
          y={16}
          style={{ fontSize: "0.5rem" }}
        >
          {minFret}
        </text>
      )}
      {FRETS.map((fret) => (
        <g key={`${fret + minFret}:fretball`}>
          {BALLS[fret + minFret] === 1 && fret !== 0 && (
            <circle
              cx={(instrument.topNames.length / 2) * 15 + 2}
              cy={fret * 27}
              r={4}
              style={{
                fill: "#999",
              }}
            ></circle>
          )}
          {BALLS[fret + minFret] === 2 && fret !== 0 && (
            <>
              <circle
                cx={(instrument.topNames.length / 2) * 15 + 2 - 10}
                cy={fret * 27}
                r={4}
                style={{
                  fill: "#999",
                }}
              ></circle>
              <circle
                cx={(instrument.topNames.length / 2) * 15 + 2 + 10}
                cy={fret * 27}
                r={4}
                style={{
                  fill: "#999",
                }}
              ></circle>
            </>
          )}
        </g>
      ))}
      {instrument.topNames.map((note, index) => (
        <g key={`${note}:${index}:label`}>
          <text x={index * 15 + 7.5} y={10} style={{ fontSize: "0.5rem" }}>
            {note}
          </text>
          <line
            x1={index * 15 + 9.5}
            x2={index * 15 + 9.5}
            y1={12}
            y2={160}
            style={{
              strokeWidth: WIDTHS[index],
              stroke: "#666",
            }}
          />
        </g>
      ))}
      {FRETS.map((fret) => (
        <line
          key={fret + minFret}
          x1={8}
          x2={(instrument.topNames.length - 1) * 15 + 10}
          y1={12 + fret * 27}
          y2={12 + fret * 27}
          style={{
            strokeWidth: 1,
            stroke: "#666",
          }}
        />
      ))}
      {chord.notes.map((note, index) =>
        note !== -1 ? (
          <circle
            key={index}
            cx={index * 15 + 9.5}
            cy={12 + (note - minFret) * 27 + (note - minFret === 0 ? 0 : -7)}
            r={5}
            style={{
              fill: "darkblue",
              fillOpacity: 0.8,
            }}
          ></circle>
        ) : null
      )}
    </svg>
  );
};
export default ChordSVG;
