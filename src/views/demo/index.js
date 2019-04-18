import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    return (
      <div>
        <text>this is demo!</text>
      </div>
    );
  }
}

export default connect(null, null)(Header);
