/** @jsxImportSource @emotion/react */
import React from 'react';
import { StringedInstrument } from 'jmusic-engine';
import { TabulatureContainer, Header, HeaderContainer } from '@design/Theme';
import Tabulature from '@components/Tabulature';

const guitar = StringedInstrument.guitar;

function ScalePage() {
  return (
    <>
      <Header>
        <HeaderContainer>Scales!</HeaderContainer>
      </Header>
      <TabulatureContainer className="chord-card">
        <Tabulature
          instrument={guitar}
          selected={[]}
          tab={[[0, 2, 2, 1, 0, 0]]}
        />
      </TabulatureContainer>
    </>
  );
}

export default ScalePage;
