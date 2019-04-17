import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginValidation from './loginValidation';

class Login extends Component {
  render() {
    return (
      <div>
        <LoginValidation {...this.props} />
      </div>
    );
  }
}

export default connect(null, null)(Login);
