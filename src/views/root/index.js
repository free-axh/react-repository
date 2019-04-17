import React, { Component } from 'react';
import { connect } from 'react-redux';

class Root extends Component {
  render() {
    return (
      <div>
        <p>12121212</p>
      </div>
    );
  }
}

export default connect(null, null)(Root);
