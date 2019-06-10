import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { switchSkin } from '../../../utils/skin/skin';
import styles from './index.module.less';

class SkinDemo extends Component {
  constructor(props) {
    super(props);
    this.skinChange = this.skinChange.bind(this);
  }

  skinChange = (className) => {
    switchSkin(className);
  }

  render() {
    return (
      <div>
        <header className={styles['skin-list-title']}>
          <h3>demo/主题色</h3>
        </header>
        <div className={styles['skin-content']}>
          <div className={styles['skin-button']}>
            <Button type="primary" onClick={() => this.skinChange('skin-default')}>默认主题色</Button>
            <Button type="primary" onClick={() => this.skinChange('skin-red')}>红色主题色</Button>
          </div>
          <div className={styles['skin-divider']} />
          <div className={styles['skin-text']}>
            <span>人生不止眼前的苟且，还有诗与远方</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(SkinDemo);
