import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.module.less';

class Loading extends Component {
  data = {
    timer: null,
  }

  static propTypes = {
    loadingState: PropTypes.bool,
  }

  static defaultProps = {
    loadingState: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      delay: 500,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { loadingState } = nextProps;
    if (loadingState) {
      this.setState({ show: true });
    } else {
      const { delay } = this.state;
      if (this.data.timer !== null) {
        clearTimeout(this.data.timer);
      }
      this.data.timer = setTimeout(() => {
        this.setState({ show: false });
      }, delay);
    }
  }

  render() {
    const { loadingState } = this.props;
    const { show, delay } = this.state;

    return (
      <div className={styles.loading} style={{ zIndex: show ? 1 : -1 }}>
        <Spin
          spinning={loadingState}
          delay={delay}
          size="large"
        />
      </div>
    );
  }
}

export default connect(null, null)(Loading);
