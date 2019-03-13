import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

//validator
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';

import './account.css'

import {
  Redirect
} from 'react-router-dom'

const styles = {
  customWidth: {
    width: 200,
  },
};

const radioStyles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
}

const style = {
  margin: 12,
};

const items = [];
for (let i = 21; i < 37; i++ ) {
  items.push(<MenuItem value={i} key={i} primaryText={`${i} days`} />);
}

const itemsAge = [];
for (let i = 12; i < 99; i++ ) {
  itemsAge.push(<MenuItem value={i} key={i} primaryText={`${i} years old`} />);
}


class Account extends Component {

  constructor(props) {
    super(props);
      this.state = {
        checked: false,
        thirdSlider: 12,
        fname: "",
        lname: "",
        email: "",
        password: "",
        retypePassword:"",
        cycleLength: 28,
        dayOfLastPeriod: "",
        age: 25,
        nonhormonal: false,
        triphasic: false,
        monophasic: false,
        progestin: false,
        token: '',
        message: '',
        loggedIn: false,
        canSubmit: false,
        disabled: true,
      }
     this.validatorListener = this.validatorListener.bind(this);
  }

  updateCheck() {
    this.setState((oldState) => {
      return {
        checked: !oldState.checked,
      };
    });
  }
  //for cycle length dropdown
  handleCycleChange = (event, index, cycleLength) => this.setState({cycleLength});
  //for age dropdown
  handleAgeChange = (event, index, age) => this.setState({age});

  createUser = async (e, {fname, lname, email, password, cycleLength, dayOfLastPeriod, age, nonhormonal, triphasic, monophasic, progestin}) => {
    e.preventDefault()
    const response = await fetch ('https://epro-api.herokuapp.com/users/register', {
      method: 'POST',
      body: JSON.stringify({
        first_name: fname,
        last_name: lname,

        email: email,
        password: password,
        age: age,
        first_day: dayOfLastPeriod,
        cycle_length: cycleLength,
        non_hormonal: nonhormonal,
        triphasic: triphasic,
        monophasic: monophasic,
        progestin: progestin
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const logged = await response.json()
    if (logged.auth_token) {
      this.setState({
        token: logged.auth_token,
        message: logged.message,
        loggedIn: true
      })
      localStorage.setItem('token', logged.auth_token)
    } else {
      this.setState({
        message: logged.message
      })
    }
    window.location.reload()
  }

  handleChange = (e, index) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  booleanChange = (e) => {
    this.setState(
        {
        monophasic: false,
        triphasic: false,
        nonhormonal: false,
        progestin: false,
        [e.target.value]: true
      }
    )
  }

  handleDate = (event, date) => {
    let newDate = date.toString()

    this.setState({dayOfLastPeriod: newDate})

  }

  validatorListener(result) {

      if(result === true && this.state.email !== "" && this.state.retypePassword !== "" && this.state.fname !== "" && this.state.lname !== ""){

          this.setState({ disabled: !result });
      } else {
          this.setState({ disabled: true });
      }
   }

   componentWillMount() {
       // custom rule will have name 'isPasswordMatch'
       ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
           if (value !== this.state.password) {
               return false;
           }
           return true;
       });
   }

  render() {
    const { loggedIn } = this.state
    if (loggedIn) {
      return (
        <Redirect to={'/hormones'}/>
      )
    }

    return (

      <div style={styles.block}>
      <p className="account-title">Account</p>

      <ValidatorForm
        ref="form"
        onSubmit={(e)=>{this.createUser(e, this.state)}}
        onError={errors => console.log(errors)}
      >

      <TextField
       floatingLabelText="First Name"
       name="fname" value={this.state.fname} onChange={this.handleChange}
       /><br />
      <TextField
       floatingLabelText="Last Name"
       name="lname" value={this.state.lname} onChange={this.handleChange}

      /><br />

      <TextValidator
          floatingLabelText="Email"
          hintText="example@email.com"
          onChange={this.handleChange}
          name="email"
          value={this.state.email}
          validators={['required', 'isEmail']}
          errorMessages={['this field is required', 'email is not valid']}
          validatorListener={this.validatorListener}
      />

      <br />

      <TextValidator
        type="password"
       floatingLabelText="Password"
       name="password"
       validators={['required']}
       errorMessages={['this field is required']}
       value={this.state.password}
       onChange={this.handleChange}

      /><br />

      <TextValidator
      type="password"
       floatingLabelText="Re-type Password"
       name="retypePassword"
       value={this.state.retypePassword}
       validators={['isPasswordMatch', 'required']}
       errorMessages={['password mismatch', 'this field is required']}
       onChange={this.handleChange}
       validatorListener={this.validatorListener}
      />

      <br />
      <br />


      <DatePicker hintText="First Day of Last Period" name="dayOfLastPeriod" onChange={this.handleDate}
      validatorListener={this.validatorListener}/>


      <p>
        <span>{'Your Cycle Length: '}</span>
      </p>

      <DropDownMenu maxHeight={300} value={this.state.cycleLength} onChange={this.handleCycleChange}>
       {items}
       </DropDownMenu>

      <br />

      <p>
        <span>{'Age:'}</span>
      </p>

      <DropDownMenu maxHeight={300} value={this.state.age} onChange={this.handleAgeChange}>
       {itemsAge}
      </DropDownMenu>

      <br />
      <br />

      <p>
        <span>{'Your Birth Control Method:'}</span>
      </p>

      <RadioButtonGroup name="contraception"
        className = 'center'
        style={radioStyles.block}
        onChange = {this.booleanChange}>

        <RadioButton
          value="nonhormonal"
          label="Non-Hormonal : None, Condoms, Paraguard/Copper IUD"
          style={radioStyles.radioButton}
        />
        <RadioButton
          value="triphasic"
          label="Triphasic : Combination Birth Control Pill - Varied Amount, Ortho Tricyclen"
          style={radioStyles.radioButton}
        />
        <RadioButton
          value="monophasic"
          label="Monophasic : Combination Birth Control Pill - Same Amount, Levora"
          style={radioStyles.radioButton}
        />
        <RadioButton
          value="progestin"
          label="Progestin : Mirena IUD, Skyla, Mini Pill, Depo Shot, The Ring"
          style={radioStyles.radioButton}
        />
        </RadioButtonGroup>

        <RaisedButton label="Submit"
        backgroundColor='#52BFAB'
        labelColor='white'
        style={style}
        type='submit'
        disabled={this.state.disabled}/>

        </ValidatorForm>


      </div>
      )
    }
  }


export default Account;
