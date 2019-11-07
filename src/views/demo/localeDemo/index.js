import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';
import BreadcrumbComponent from '../../../common/Breadcrumb/BreadcrumbComponent';

class LocaleDemo extends Component {
  static propTypes = {
    currLocale: PropTypes.string.isRequired,
    switchLocale: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.localeChange = this.switchLocale.bind(this);
    this.state = {
      BreadcrumbMessage: [
        { title: 'demo' },
        { title: '多语言' },
      ],
    };
  }

  switchLocale = () => {
    const { currLocale, switchLocale } = this.props;
    console.log('currLocale', currLocale);
    const lc = currLocale === 'en' ? 'zh' : 'en';
    switchLocale(lc);
  }

  render() {
    console.log(this.props);
    const { BreadcrumbMessage } = this.state;

    return (
      <div>
        <header className={styles['locale-list-title']}>
          <BreadcrumbComponent BreadcrumbMessage={BreadcrumbMessage} />
        </header>
        <div className={styles['locale-content']}>
          <div className={styles['locale-button']}>
            <Button type="primary" onClick={() => this.switchLocale('locale-default')}>zh_US</Button>
            <Button type="primary" onClick={() => this.switchLocale('locale-red')}>en_US</Button>
          </div>
          <div className={styles['locale-divider']} />
          <div className={styles['locale-text']}>
            <FormattedMessage
              id="text"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    currLocale: state.rootReducers.currLocale,
  }),
  dispatch => ({
    switchLocale: (payload) => {
      dispatch({ type: 'root/SWITCH_LOCALEN', payload });
    },
  }),
)(injectIntl(LocaleDemo));
