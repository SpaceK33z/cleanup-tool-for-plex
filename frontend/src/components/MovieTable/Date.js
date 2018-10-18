import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ONE_DAY = 24 * 60 * 60 * 1000;

export default class MovieTableDate extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
  };

  render() {
    const { date } = this.props;
    const movieDate = new Date(date);
    const now = new Date();
    return (
      <span>
        {Math.round(Math.abs((movieDate.getTime() - now.getTime()) / ONE_DAY))}
        {' days ago'}
      </span>
    );
  }
}
