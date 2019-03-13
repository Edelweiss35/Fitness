import React, { Component } from 'react';
import './userbase-charts.js';
import './userbase.css';

class Userbase extends Component {
    constructor () {
      super();
      this.state = { users: [], non_hormonal: [], triphasic: [], monophasic: [], progestin: []  };
    }

    render() {
        return (
          <div id='userbase'>
            <svg id="svg1"></svg>
            <svg id="svg2"></svg>
            <svg id="svg3"></svg>
          </div>
        )


    }

}


export default Userbase;
