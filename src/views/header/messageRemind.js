import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Popover } from 'antd';
import PropTypes from 'prop-types';
import { push } from '../../utils/router/routeMethods';
import msg1 from '../../static/image/msg1.png';
import msg2 from '../../static/image/msg2.png';
import msg3 from '../../static/image/msg3.png';
import styles from './index.module.less';

class MessageRemind extends Component {
  static propTypes = {
    getMessageData: PropTypes.func.isRequired,
    messageRemindData: PropTypes.object,
  }

  static defaultProps = {
    messageRemindData: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      messageRemindData: {
        numDown: 0, // 设备服务已过期数
        numDownSoon: 0, // 设备服务即将到期数
        numEnd: 0, // 设备已停机数
        numEndSoon: 0, // 设备即将停机数
      },
      visible: false,
    };
  }

  componentDidMount() {
    const { getMessageData } = this.props;
    getMessageData();
  }

  componentWillReceiveProps(nextProps) {
    const { messageRemindData } = nextProps;
    if (messageRemindData) {
      this.setState({ messageRemindData });
    }
  }

  // 控制窗口显示隐藏
  popverShow=(value) => {
    this.setState({
      visible: value,
    });
  }

  // 链接跳转
  linkJump=(item) => {
    push('/terminalManagement', { msgType: item.type });
    this.popverShow(false);
  }

  getImgSrc=(index) => {
    let imgSrc = msg1;
    switch (index) {
      case 2:
        imgSrc = msg2;
        break;
      case 3:
        imgSrc = msg3;
        break;
      default:
        break;
    }
    return imgSrc;
  }

  /**
   * 组装消息提醒数据
   */
  getMessageDom = () => {
    const {
      messageRemindData: { numDown, numDownSoon, numEnd, numEndSoon },
    } = this.state;

    if (numDown === 0 && numDownSoon === 0 && numEnd === 0 && numEndSoon === 0) {
      return (
        <ul className={styles['message-remind']}>
          <li>
            <div className={styles['message-link']}>
              暂无消息提醒
            </div>
          </li>
        </ul>
      );
    }

    const data = [];
    if (numDownSoon !== 0) {
      data.push({
        title: `有${numDownSoon}个设备即将停机`,
        type: 2,
      });
    }
    if (numEndSoon !== 0) {
      data.push({
        title: `有${numEndSoon}个设备服务即将到期`,
        type: 3,
      });
    }
    if (numDown !== 0) {
      data.push({
        title: `有${numDown}个设备已停机`,
        type: 4,
      });
    }
    if (numEnd !== 0) {
      data.push({
        title: `有${numEnd}个设备服务已过期`,
        type: 5,
      });
    }

    return (
      <ul className={styles['message-remind']}>
        {
          data.map((item, index) => (
            <li key={item.type}>
              <div onClick={() => { this.linkJump(item); }} className={styles['message-link']}>
                <img alt="" src={this.getImgSrc((index % 3) + 1)} /> {item.title}
              </div>
            </li>
          ))
        }
      </ul>
    );
  }

  render() {
    const content = this.getMessageDom();
    const { visible } = this.state;

    return (
      <Popover
        content={content}
        trigger="click"
        placement="bottomRight"
        visible={visible}
        onVisibleChange={(modalvisible) => {
          if (!modalvisible) {
            this.popverShow(false);
          }
        }}
      >
        <Button type="primary" shape="circle" icon="mail" onClick={() => { this.popverShow(true); }} />
      </Popover>
    );
  }
}

export default connect(
  state => ({
    messageRemindData: state.messageRemindReducers.messageRemindData,
  }),
  dispatch => ({
    getMessageData: () => {
      dispatch({ type: 'message/MSGDATA_ACTION' });
    },
  }),
)(MessageRemind);
