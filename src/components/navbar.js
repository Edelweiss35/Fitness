import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {
  Link
} from 'react-router-dom'

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  logout = async () => {
    await fetch(`https://epro-api.herokuapp.com/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    })
    localStorage.removeItem('token')
    window.location.reload()
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => {
    this.setState({open: false})
    window.location.reload()
  };

  render() {
    return (
          <div>

              <AppBar
                title="E/PRO"
                  style={{backgroundColor:'#484043', fontFamily: 'Julius Sans One', textAlign:'right'}}
                  onClick={this.handleToggle}
                  iconClassNameRight="muidocs-icon-navigation-expand-more"
                  className="navbar-style"
              />

              <Drawer

                  docked={false}
                  width={200}
                  open={this.state.open}
                  onRequestChange={(open) => this.setState({open})}>

                <Link to={`/hormones`} style={{textDecoration: 'none'}}>
                  <MenuItem
                  style={{fontFamily: 'Julius Sans One'}}
                  onClick={this.handleClose}>My Cycle</MenuItem>
                </Link>

                {/* <Link to={`/account`} style={{textDecoration: 'none'}}>
                <MenuItem style={{fontFamily: 'Julius Sans One'}}
                onClick={this.handleClose}>Account</MenuItem>
                </Link> */}

                <Link to={`/userbase`} style={{textDecoration: 'none'}}>
                <MenuItem style={{fontFamily: 'Julius Sans One'}}
                onClick={this.handleClose}>User Base</MenuItem>
                </Link>

                <Link to={`/login`} style={{textDecoration: 'none'}}>
                <MenuItem style={{fontFamily: 'Julius Sans One'}} onClick={()=>{this.logout()}}>Logout</MenuItem>
                </Link>

              </Drawer>
            </div>

      )
  }
}


export default Navbar;
