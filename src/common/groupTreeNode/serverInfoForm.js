// 服务器地址信息
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Row, Input, Col, Icon, Button,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';

class ServerInfoForm extends Component {
  static propTypes = {
    changeServerParam: PropTypes.func.isRequired,
    additionalServerData: PropTypes.array.isRequired,
    visibleKey: PropTypes.string,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visibleKey: null,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 同组织下的服务器名称不能重复
  serverNameValidate=(rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    const { form: { getFieldsValue } } = this.props;
    const allParam = getFieldsValue();
    Object.keys(allParam).map((item) => {
      if (item !== rule.field && item.indexOf('serverName') !== -1) {
        if (allParam[item] === value) {
          callback(<FormattedMessage id="groupTree_servername_validate" />);
        }
      }
      return item;
    });
    callback();
  }

  // 校验域名及IP
  serverValidate=(rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    // IP
    const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    // 域名
    const domainNamereg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    if (ipReg.test(value) || domainNamereg.test(value)) {
      callback();
    } else {
      callback(<FormattedMessage id="groupTree_ipdomain_validate" />);
    }
  }

  // 改变服务器表单
  changeServerParamFun=(type, index) => {
    const { changeServerParam } = this.props;
    changeServerParam(type, index);
  }

  render() {
    const {
      visibleKey, additionalServerData, intl: { messages },
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const allParamValue = getFieldsValue();

    return (
      <div id="addServerBox">
        {additionalServerData.map((item, index) => (
          <div
            key={item.serverAddress ? item.serverAddress : index}
            className={visibleKey === 'detail' ? styles['server-row-box-detail'] : styles['server-row-box']}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label={<FormattedMessage id="groupTree_server_name" />}>
                  {getFieldDecorator(`serverName${index}`, {
                    rules: [
                      {
                        validator: this.serverNameValidate,
                      },
                    ],
                  })(
                    visibleKey === 'detail'
                      ? (<div className={styles['detail-info-text']}>{allParamValue[`serverName${index}`]}</div>)
                      : <Input placeholder={messages.groupTree_input_servername} autoComplete="off" allowClear />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={<FormattedMessage id="groupTree_serverip_address" />}>
                  {getFieldDecorator(`serverAddress${index}`, {
                    rules: [
                      {
                        validator: this.serverValidate,
                      },
                    ],
                  })(
                    visibleKey === 'detail'
                      ? (<div className={styles['detail-info-text']}>{allParamValue[`serverAddress${index}`]}</div>)
                      : <Input placeholder={messages.groupTree_input_serveraddress} autoComplete="off" allowClear />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={<FormattedMessage id="groupTree_port" />}>
                  {getFieldDecorator(`port${index}`, {
                    rules: [
                      {
                        pattern: new RegExp(/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/),
                        message: <FormattedMessage id="groupTree_port_validate" />,
                      },
                    ],
                  })(
                    visibleKey === 'detail'
                      ? (<div className={styles['detail-info-text']}>{allParamValue[`port${index}`]}</div>)
                      : <Input placeholder={messages.groupTree_input_port} maxLength={5} autoComplete="off" allowClear />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            {index === 0 && visibleKey !== 'detail'
              ? (
                <Button type="link" className={styles['add-server-button']} onClick={() => { this.changeServerParamFun('addServer', index); }}>
                  <Icon type="plus" />
                </Button>
              ) : null
            }
            {index > 0 && visibleKey !== 'detail'
              ? (
                <Button type="link" className={styles['delete-server-button']} onClick={() => { this.changeServerParamFun('deleteServer', index); }}>
                  <Icon type="delete" />
                </Button>
              ) : null
            }
          </div>
        ))}
      </div>
    );
  }
}
export default connect(
  state => ({
    visibleKey: state.groupTreeReducers.visibleKey,
  }),
)(injectIntl(ServerInfoForm));
