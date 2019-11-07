// 省市区级联选择公共组件
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Cascader,
} from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import city from './city';

class CitySelect extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired, // 表单
    name: PropTypes.string.isRequired, // 参数名
  }

  constructor(props) {
    super(props);
    this.state = {
      cityValue: [], // 选中的城市
    };
  }

  componentWillReceiveProps(nextProps) {
    const { name, form: { getFieldsValue }, form } = nextProps;
    if (form) {
      const cityValue = getFieldsValue([name])[name];
      if (cityValue) {
        const cityId = cityValue.split(',')[1] || null;
        if (cityId) {
          this.setState({
            cityValue: cityId.split('/'),
          });
        }
      }
    }
  }

  // 选择城市,组装格式:(省市区中文名,省市区json格式中的value值)
  cityChange=(value, selectedOptions) => {
    const { name, form: { setFieldsValue } } = this.props;
    const obj = {};
    const nameArr = [];
    selectedOptions.map((item) => {
      nameArr.push(item.label);
      return item;
    });
    obj[name] = `${nameArr.join('/')},${value.join('/')}`;
    setFieldsValue(obj);
  }

  render() {
    const { intl: { messages } } = this.props;
    const { cityValue } = this.state;

    return (
      <Cascader
        options={city}
        value={cityValue}
        onChange={this.cityChange}
        placeholder={messages.citySelect_input_txt}
        showSearch
      />
    );
  }
}
export default connect()(injectIntl(CitySelect));
