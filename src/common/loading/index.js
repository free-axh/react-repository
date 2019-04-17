import React, { Component } from 'react';
import { connect } from 'react-redux';

class Loading extends Component {
  render() {
    return (
      <div>
        <p>this is loading!</p>
      </div>
    );
  }
}

export default connect(null, null)(Loading);
