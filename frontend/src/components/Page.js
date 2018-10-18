import React, { Component } from 'react';
import TorrentTable from './TorrentTable';
import MovieTable from './MovieTable';
import DiskspaceUsage from './DiskspaceUsage';
import { Tabs, Layout } from 'antd';

const { Content } = Layout;
const { TabPane } = Tabs;

export default class Page extends Component {
  static propTypes = {};

  render() {
    return (
      <Layout className="layout">
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <DiskspaceUsage />
            <Tabs defaultActiveKey="1">
              <TabPane tab="Torrents" key="1">
                <TorrentTable />
              </TabPane>
              <TabPane tab="Movies" key="2">
                <MovieTable />
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
    );
  }
}
