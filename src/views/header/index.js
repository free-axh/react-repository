import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    console.log(11111);
    return (
      <div>
        <p>this is header!</p>
      </div>
    );
  }
}

export default connect(null, null)(Header);
