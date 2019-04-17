import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    return (
      <div>
        <p>this is home!</p>
      </div>
    );
  }
}

export default connect(null, null)(Home);
