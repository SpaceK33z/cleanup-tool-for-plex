import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ONE_DAY = 24 * 60 * 60 * 1000;

export default class TorrentTableDate extends Component {
  static propTypes = {
    date: PropTypes.number.isRequired,
  };

  render() {
    const { date } = this.props;
    const torrentDate = new Date(date * 1000);
    const now = new Date();
    return (
      <span>
        {Math.round(
          Math.abs((torrentDate.getTime() - now.getTime()) / ONE_DAY)
        )}
        {' days ago'}
      </span>
    );
  }
}
