import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const CircularProgressExampleSimple = () => (
  <div>
    <div className = "spinner-spacer"></div>
    <CircularProgress size={100} thickness={7} />
  </div>
);

export default CircularProgressExampleSimple;
