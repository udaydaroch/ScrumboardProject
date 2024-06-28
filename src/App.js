// App.js
import React from 'react';
import Scrumboard from './Scrumboard';
import { CssBaseline, Container } from '@mui/material';

const App = () => {
  return (
      <div>
        <CssBaseline />
        <Container>
          <Scrumboard />
        </Container>
      </div>
  );
};

export default App;
