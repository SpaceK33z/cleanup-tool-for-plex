import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

const CUT_OFF = 20;

export default class TorrentTableErrors extends Component {
  static propTypes = {
    errors: PropTypes.string.isRequired,
  };

  render() {
    const { errors } = this.props;
    return (
      <Tooltip title={errors.length > CUT_OFF ? errors : ''}>
        <span style={{ color: 'red' }}>
          {errors.substr(0, CUT_OFF) + (errors.length > CUT_OFF ? '…' : '')}
        </span>
      </Tooltip>
    );
  }
}
