import React, { Component } from 'react';
import { fetchTorrents, deleteTorrents } from '../api';
import { Table } from 'antd';
import filesize from 'filesize';
import TorrentTableDate from './TorrentTable/Date';
import { Button } from 'antd';
import TorrentTableErrors from './TorrentTable/Errors';

function columns(data) {
  const uniqueDownloadDirs = Array.from(
    new Set(data.map(item => item.downloadDir))
  );
  const uniqueErrors = Array.from(
    new Set(data.map(item => item.errorString))
  ).filter(Boolean);
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
    },
    {
      title: 'Size',
      dataIndex: 'sizeWhenDone',
      key: 'sizeWhenDone',
      render: sizeBytes => filesize(sizeBytes),
      sorter: (a, b) => a.sizeWhenDone - b.sizeWhenDone,
    },
    {
      title: 'Date added',
      dataIndex: 'addedDate',
      key: 'addedDate',
      render: date => <TorrentTableDate date={date} />,
      sorter: (a, b) => a.addedDate - b.addedDate,
    },
    {
      title: 'Directory',
      dataIndex: 'downloadDir',
      key: 'downloadDir',
      sorter: (a, b) => {
        if (a.downloadDir < b.downloadDir) return -1;
        if (a.downloadDir > b.downloadDir) return 1;
        return 0;
      },
      filters: uniqueDownloadDirs.map(dir => ({ text: dir, value: dir })),
      onFilter: (value, item) => item.downloadDir === value,
    },
    {
      title: 'Errors',
      dataIndex: 'errorString',
      key: 'errorString',
      sorter: (a, b) => {
        if (a.errorString < b.errorString) return -1;
        if (a.errorString > b.errorString) return 1;
        return 0;
      },
      filters: uniqueErrors.map(err => ({ text: err, value: err })),
      onFilter: (value, item) => item.errorString === value,
      render: errorString => <TorrentTableErrors errors={errorString} />,
    },
  ];
}
export default class TorrentTable extends Component {
  static propTypes = {};
  state = {
    data: [],
    selectedRowKeys: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ loading: true });
    const result = await fetchTorrents();
    this.setState({ data: result.data, loading: false });
  }

  handleSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleDelete = async () => {
    const ids = this.state.selectedRowKeys;
    this.setState({ loading: true, selectedRowKeys: [] });
    try {
      await deleteTorrents(ids);
    } catch (e) {
      this.setState({ loading: false });
    }
    await this.fetchData(ids);
  };

  selectionText = () => {
    const { data, selectedRowKeys } = this.state;
    const selectedItems = selectedRowKeys.map(id =>
      data.find(item => item.id === id)
    );
    const totalSize = selectedItems.reduce(
      (prevVal, item) => prevVal + item.sizeWhenDone,
      0
    );
    return `${selectedRowKeys.length} items with ${filesize(totalSize)}`;
  };

  render() {
    const { data, selectedRowKeys, loading } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <h1>Torrents</h1>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="danger"
            onClick={this.handleDelete}
            disabled={!hasSelected}
            loading={loading}
          >
            Delete
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? this.selectionText() : ''}
          </span>
        </div>

        <Table
          dataSource={data}
          columns={columns(data)}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: this.handleSelectChange,
          }}
        />
      </div>
    );
  }
}
