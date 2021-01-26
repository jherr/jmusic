import React from 'react';
import { StringedInstrument } from '@engine/strings';

const LINE_HEIGHT = 30;

const Tableture: React.FC<{
  instrument: StringedInstrument;
  tab: number[][];
  clickHandler: (index: number) => void;
  selected: number[];
}> = ({ instrument, tab, clickHandler, selected }) => {
  return (
    <div style={{ display: 'inline' }}>
      <TabStartSVG instrument={instrument} />
      {tab.map((chord, index) => {
        return (
          <TabSVG
            chord={chord}
            index={index}
            instrument={instrument}
            key={index}
            handleClick={clickHandler}
            selected={selected}
          />
        );
      })}
      <TabEndSVG instrument={instrument} />
    </div>
  );
};

const TabSVG: React.FC<{
  chord: number[];
  instrument: StringedInstrument;
  index: number;
  handleClick: (index: number) => void;
  selected: number[];
}> = ({ chord, instrument, index, handleClick, selected }) => {
  const backgroundColor = selected.includes(index) ? 'black' : 'white';
  const lineStrokeColor = selected.includes(index) ? 'white' : 'black';
  const numberStrokeColor = selected.includes(index) ? 'white' : 'black';
  return (
    <svg
      style={{ display: 'inline', backgroundColor: `${backgroundColor}` }}
      width="30"
      height={instrument.numStrings * LINE_HEIGHT}
      onClick={() => handleClick(index)}
    >
      {chord.map((fretNum, stringIndex) => {
        const y =
          LINE_HEIGHT * (instrument.numStrings - stringIndex) -
          5 +
          LINE_HEIGHT / 2;
        return (
          <>
            <line
              x1="0"
              x2="30"
              y1={y}
              y2={y}
              style={{ strokeWidth: '1', stroke: `${lineStrokeColor}` }}
              key={`line_${y}`}
            />

            <line
              x1="3"
              x2="18"
              y1={y}
              y2={y}
              style={{ strokeWidth: '1', stroke: `${backgroundColor}` }}
              key={`line_${index}_${fretNum}_${y}`}
            />

            <text
              x={16}
              y={y + LINE_HEIGHT / 3.5}
              style={{
                fontSize: `${LINE_HEIGHT * 0.8}px`,
                fill: `${numberStrokeColor}`,
              }}
              className={'number'}
              key={`chord_${index}_${fretNum}_${y}`}
            >
              {fretNum === -1 ? 'X' : fretNum}
            </text>
          </>
        );
      })}
    </svg>
  );
};

const TabStartSVG: React.FC<{
  instrument: StringedInstrument;
}> = ({ instrument }) => {
  const lines = [];
  for (let string = 0; string < instrument.numStrings; string++) {
    lines.push({
      y: LINE_HEIGHT * (instrument.numStrings - string) - 5 + LINE_HEIGHT / 2,
      tuning: instrument.topNames[string],
    });
  }

  return (
    <svg
      style={{ display: 'inline', backgroundColor: 'white' }}
      width="30"
      height={instrument.numStrings * LINE_HEIGHT}
    >
      {lines.map((fretNum, stringIndex) => {
        const y =
          LINE_HEIGHT * (instrument.numStrings - stringIndex) -
          5 +
          LINE_HEIGHT / 2;
        const noteName = instrument.topNames[stringIndex];
        return (
          <>
            <line
              x1="15"
              x2="30"
              y1={y}
              y2={y}
              style={{ strokeWidth: 1, stroke: 'black' }}
              key={`line_${y}`}
            />
            <text
              x="0"
              y={y + LINE_HEIGHT / 4}
              style={{
                fontSize: `${LINE_HEIGHT * 0.8}px`,
                fill: 'black',
                fontFamily: 'Arial, Verdana, Sans-Serif',
              }}
              key={`tuning_${y}`}
            >
              {noteName}
            </text>
          </>
        );
      })}
    </svg>
  );
};

const TabEndSVG: React.FC<{
  instrument: StringedInstrument;
}> = ({ instrument }) => {
  return (
    <svg
      style={{ display: 'inline', backgroundColor: 'white' }}
      width={2}
      height={instrument.numStrings * LINE_HEIGHT}
    >
      <line
        x1="1"
        x2="1"
        y1={LINE_HEIGHT * 1.1}
        y2={instrument.numStrings * LINE_HEIGHT - 5 + LINE_HEIGHT / 2}
        style={{ strokeWidth: 1, stroke: 'black' }}
      />
    </svg>
  );
};

export default Tableture;
