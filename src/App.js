import React from 'react';
import logo from './logo.svg';
import './App.css';

import config from './config.json';
import Links from './Components/Links';
import CreateLink from './Components/CreateLink';
import { Grid, Container, Divider } from '@material-ui/core';

const LINKS_URL = `//${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/api/links`;

function App() {
  return (
    <div className="App">
      <Container>
      <Grid container>
        <Grid item md={12} lg={12}>
          <h2>Short Links</h2>
          <CreateLink/>
          <Divider/>
          <Links/>
      </Grid>
      </Grid>
      </Container>
    </div>
  );
}

export default App;
