import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import './hormone-chart.js';
import './hormone.css';

import Login from './login';
import Spinner from './spinner';

import {
  Redirect
} from 'react-router-dom'

const styles = {
  margin: 16,
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  paper: {
    height: 50,
    maxWidth: 800,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
    marginTop: 30,
    backgroundColor: '#ffdfaa',
    fontFamily: 'Julius Sans One',
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    color: 'black',
  }
};

class Hormones extends Component {

  constructor(props) {
    super(props);
    this.state = {
      category: '',
      exercise: '',
      nutrition: '',
      username: '',
      loggedIn: localStorage.getItem('token') ? true : false
    }
  }

  async componentWillMount() {
    const response = await fetch('https://epro-api.herokuapp.com/auth/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    })
    const json = await response.json()
    if (json.status === 'success') {

      const x = await fetch(`https://epro-api.herokuapp.com/users/${json.data.user_id}`)
      const user = await x.json()
      const first_name = user.first_name

      const cycleLength = user.cycle_length
      const firstDay = user.first_day

      const diff = Math.floor(( Date.parse(new Date()) - Date.parse(firstDay)) / 86400000) % cycleLength;
      let tipNumber
      const phase = cycleLength / 4

      if (diff >= 0 && diff <= phase) {
        tipNumber = 1
      } else if (diff > phase && diff <= phase * 2) {
        tipNumber = 2
      } else if (diff > phase * 2 && diff <= phase * 3) {
        tipNumber = 3
      } else {
        tipNumber = 4
      }

      const getTip = await fetch(`https://epro-api.herokuapp.com/tips/${tipNumber}`)
      const tipToDisplay = await getTip.json()
      this.setState({
        'loggedIn': true,
        'category': tipToDisplay.category,
        'exercise': tipToDisplay.exercise_decription,
        'nutrition': tipToDisplay.nutrition_info,
        'username': first_name + "'s "
      })

    }
  }

  render() {
    if(this.state.username === "" && this.state.loggedIn === true){
      return (
        <Spinner/>
      )
    }

    if(!this.state.loggedIn){
      return (
         <Redirect to='/login' render={()=> (
           <Login/>
         )}/>
       )
    }

    return (
      <div>
       <Paper style={styles.paper} zDepth={2}>
        {`${this.state.username} ${this.state.category}`}
       </Paper>

      <div id="chart"></div>

      <Tabs>
        <Tab label="Exercise" style={{fontFamily: 'Julius Sans One', backgroundColor:'#52BFAB'}}>
          <div>

            <h2 style={{fontFamily: 'Julius Sans One'}}>{this.state.category}</h2>
            <div style={{fontFamily: 'Alegreya Sans'}}>
              <p style={{lineHeight:2.5}}>{this.state.exercise}</p>
            </div>

          </div>
        </Tab>

        <Tab label="Nutrition" style={{fontFamily: 'Julius Sans One', backgroundColor:'#52BFAB'}}>
          <div>
            <h2 style={{fontFamily: 'Julius Sans One'}}>{this.state.category}</h2>
            <div style={{fontFamily: 'Alegreya Sans'}}>
            <p style={{lineHeight:2.5}}>
              {this.state.nutrition}
            </p>
          </div>
          </div>
        </Tab>

      </Tabs>
      </div>
    )
  }
}

export default Hormones;
