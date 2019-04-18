import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from '../../utils/router/routeMethods';

class Home extends Component {
  goDemo = () => {
    push('/demo');
  }

  render() {
    return (
      <div>
        <p>this is home!</p>
        <FormattedMessage
          id="hello"
        />
        <button type="button" onClick={this.goDemo}>去demo页</button>
      </div>
    );
  }
}

export default connect(null, null)(injectIntl(Home));
