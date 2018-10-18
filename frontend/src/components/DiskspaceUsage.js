import React, { Component } from 'react';
import { fetchDiskspace } from '../api';
import filesize from 'filesize';
import { Icon, Progress } from 'antd';

const REFRESH_RATE = 10000;
const WARNING_SIZE_PERCENT = 98;

export default class DiskspaceUsage extends Component {
  static propTypes = {};
  state = {
    data: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(this.fetchData, REFRESH_RATE);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData = async () => {
    this.setState({ loading: true });
    const result = await fetchDiskspace();
    this.setState({ data: result.data, loading: false });
  };

  render() {
    const { data, loading } = this.state;
    return (
      <div>
        <h1>
          Disk space {loading ? <Icon type="loading" theme="outlined" /> : ''}
        </h1>
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {data.filter(disk => !disk.path.startsWith('/boot')).map(disk => {
            const percent = 100 - (disk.freeSpace / disk.totalSpace) * 100;
            return (
              <div key={disk.path} style={{ marginRight: 30 }}>
                <h2>{disk.path}</h2>
                <Progress
                  type="circle"
                  percent={percent}
                  status={
                    percent > WARNING_SIZE_PERCENT ? 'exception' : undefined
                  }
                  format={percent =>
                    `${filesize(disk.freeSpace, { round: 0 })}`
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
