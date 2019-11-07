import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginValidation from './loginValidation';
import ImageCode from '../../common/imageCode/index';
import image from '../../static/image/bg.jpg';

import styles from './index.module.less';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      imageCodeState: false,
    };
    this.onLogin = this.onLogin.bind(this);
    this.onMatch = this.onMatch.bind(this);
  }

  onReload = () => {
    this.setState({ url: 'http://mapopen-website-wiki.cdn.bcebos.com/index/newIndex/banner-shouye.jpg' });
  }

  onLogin = () => {
    this.setState({
      imageCodeState: true,
    }, () => {
      this.setState({
        url: image,
      });
    });
  }

  onMatch = () => {

  }

  render() {
    const { url, imageCodeState } = this.state;

    return (
      <div className={styles['login-bg']}>
        <LoginValidation {...this.props} onLogin={this.onLogin} />
        {
          imageCodeState ? (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                display: 'flex',
              }}
            >
              <ImageCode
                imageUrl={url}
                onReload={this.onReload}
                onMatch={this.onMatch}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default connect(null, null)(Login);
