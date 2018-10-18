import React, { Component } from 'react';
import { fetchMovies, deleteMovies } from '../api';
import { Table } from 'antd';
import filesize from 'filesize';
import { Button } from 'antd';
import MovieTableDate from './MovieTable/Date';

function removeLastFolderFromPath(path) {
  const paths = path.split('/');
  paths.pop();
  return paths.join('/');
}

function columns(data) {
  const uniquePaths = Array.from(
    new Set(data.map(item => removeLastFolderFromPath(item.path)))
  );
  return [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      },
      render: (title, item) => {
        return `${title} (${item.year})`;
      },
    },
    {
      title: 'Size',
      dataIndex: 'sizeOnDisk',
      key: 'sizeOnDisk',
      render: sizeBytes => filesize(sizeBytes),
      sorter: (a, b) => a.sizeOnDisk - b.sizeOnDisk,
    },
    {
      title: 'Date added',
      dataIndex: 'added',
      key: 'added',
      render: date => <MovieTableDate date={date} />,
      sorter: (a, b) => {
        if (a.added < b.added) return -1;
        if (a.added > b.added) return 1;
        return 0;
      },
    },
    {
      title: 'Directory',
      dataIndex: 'path',
      key: 'path',
      sorter: (a, b) => {
        if (a.path < b.path) return -1;
        if (a.path > b.path) return 1;
        return 0;
      },
      filters: uniquePaths.map(dir => ({ text: dir, value: dir })),
      onFilter: (value, item) => item.path.startsWith(value),
      render: removeLastFolderFromPath,
    },
  ];
}
export default class MovieTable extends Component {
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
    const result = await fetchMovies();
    this.setState({ data: result.data, loading: false });
  }

  handleSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleDelete = async () => {
    const ids = this.state.selectedRowKeys;
    this.setState({ loading: true, selectedRowKeys: [] });
    try {
      await deleteMovies(ids);
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
      (prevVal, item) => prevVal + item.sizeOnDisk,
      0
    );
    return `${selectedRowKeys.length} items with ${filesize(totalSize)}`;
  };

  render() {
    const { data, selectedRowKeys, loading } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <h1>Movies</h1>
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
