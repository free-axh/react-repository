import React, { Component } from 'react';
import { connect } from 'react-redux';

class Toast extends Component {
  render() {
    return (
      <div>
        <p>this is Toast!</p>
      </div>
    );
  }
}

export default connect(null, null)(Toast);
