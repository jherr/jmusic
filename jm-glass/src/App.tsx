/** @jsxImportSource @emotion/react */
import React from 'react';
import 'tailwindcss/dist/base.min.css';
import './App.css';
import { MainContainer } from '@design/Theme';
import { HashRouter as Router, Route } from 'react-router-dom';
import ChordPage from './ChordPage';
import ScalePage from './ScalePage';

function App() {
  return (
    <Router>
      <MainContainer>
        <Route path="/scales">
          <ScalePage />
        </Route>
        <Route path="/" exact>
          <ChordPage />
        </Route>
      </MainContainer>
    </Router>
  );
}

export default App;
