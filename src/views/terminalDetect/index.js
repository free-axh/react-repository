import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import TableHandler from './tableHandler';
import DetectionSeniorSearchList from './detectionSeniorSearchList';
import QualifiedSeniorSearchList from './qualifiedSeniorSearchList';
import styles from './index.module.less';
import DetectionTable from './detectionTable';
import QualifiedTable from './qualifiedTable';
import BreadcrumbComponent from '../../common/Breadcrumb/BreadcrumbComponent';
import ColumnCustom from '../../common/columnCustom';

const { TabPane } = Tabs;

class TerminalDetect extends Component {
  // 属性声明
  static propTypes ={
    saveQualifiedTableSelectionData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tabsActiveKey: '1',
      detectionTableCustom: [],
      qualifiedTableCustom: [],
    };
    this.tabsOnChange = this.tabsOnChange.bind(this);
    this.onDetectionCustomEvent = this.onDetectionCustomEvent.bind(this);
    this.setDetectionCustomFun = this.setDetectionCustomFun.bind(this);
    this.onQualifiedCustomEvent = this.onQualifiedCustomEvent.bind(this);
    this.setQualifiedCustomFun = this.setQualifiedCustomFun.bind(this);
    console.log('终端检测', this.props);
  }

  data = {
    breadcrumb: [
      { title: (
        <FormattedMessage
          id="terminalDetect_dashboard"
        />
      ) },
      { title: (
        <FormattedMessage
          id="terminalDetect_equipment_management"
        />
      ) },
      { title: (
        <FormattedMessage
          id="terminalDetect_title"
        />
      ) },
    ],
  }

  /**
   * tabs切换面板回调
   */
  tabsOnChange = (activeKey) => {
    this.setState({ tabsActiveKey: activeKey });
    if (activeKey === '1') {
      const { saveQualifiedTableSelectionData } = this.props;
      saveQualifiedTableSelectionData(1);
    }
  }

  /**
   * 检测列表列数据配置
   */
  onDetectionCustomEvent = (infos) => {
    this.setState({ detectionTableCustom: infos });
  }

  /**
   * 合格列表列数据配置
   */
  onQualifiedCustomEvent = (infos) => {
    this.setState({ qualifiedTableCustom: infos });
  }

  /**
   * 设置检测列表列配置
   */
  setDetectionCustomFun = (detectionTableCustom) => {
    this.setState({ detectionTableCustom });
  }

  /**
   * 设置合格列表列配置
   */
  setQualifiedCustomFun = (qualifiedTableCustom) => {
    this.setState({ qualifiedTableCustom });
  }

  render() {
    const { tabsActiveKey, detectionTableCustom, qualifiedTableCustom } = this.state;

    return (
      <div className={styles.main}>
        <BreadcrumbComponent breadcrumbMessage={this.data.breadcrumb} />
        <Tabs
          className={styles.tabs}
          defaultActiveKey="1"
          animated={false}
          onChange={this.tabsOnChange}
        >
          <TabPane
            tab={
              (
                <FormattedMessage
                  id="terminalDetect_detection_tab"
                />
              )
            }
            key="1"
          >
            <div className={styles['tabs-content']}>
              <div className={styles['table-handler']}>
                <div className={styles['handler-left']}>
                  <TableHandler tabsActiveKey={tabsActiveKey} />
                </div>
                <div className={styles['handler-right']}>
                  <DetectionSeniorSearchList />
                  <ColumnCustom
                    customFun={this.setDetectionCustomFun}
                    columns={detectionTableCustom}
                  />
                </div>
              </div>
              <div>
                <DetectionTable
                  onDetectionCustom={this.onDetectionCustomEvent}
                  detectionColums={detectionTableCustom}
                />
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={
              (
                <FormattedMessage
                  id="terminalDetect_qualified_tab"
                />
              )
            }
            key="2"
          >
            <div className={styles['tabs-content']}>
              <div className={styles['table-handler']}>
                <div className={styles['handler-left']}>
                  <TableHandler tabsActiveKey={tabsActiveKey} />
                </div>
                <div className={styles['handler-right']}>
                  <QualifiedSeniorSearchList tabsActiveKey={tabsActiveKey} />
                  <ColumnCustom
                    customFun={this.setQualifiedCustomFun}
                    columns={qualifiedTableCustom}
                  />
                </div>
              </div>
              <div>
                <QualifiedTable
                  onQualifiedCustom={this.onQualifiedCustomEvent}
                  qualifiedColums={qualifiedTableCustom}
                  tabsActiveKey={tabsActiveKey}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    saveQualifiedTableSelectionData: (data) => {
      dispatch({ type: 'terminaDetect/SET_QUALIFIED_TABLE_OPERATION_SETTING', payload: data });
    },
  }),
)(injectIntl(TerminalDetect));
