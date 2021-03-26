import React from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreOutlined,
  BuildOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { CredentialsProvider } from './CredentialsProvider'
import { HttpProvider } from './HttpProvider'
import { Settings } from './pages/settings/Settings'
import { QueuesIndex } from './pages/queues'

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider>
        <Menu theme="dark">
          <Menu.Item icon={<AppstoreOutlined />} key="/">
            <Link to="/">Overview</Link>
          </Menu.Item>
          <Menu.Item icon={<BuildOutlined />} key="/queues">
            <Link to="/queues">Queues</Link>
          </Menu.Item>
          <Menu.Item icon={<SettingOutlined />} key="/settings">
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content style={{ background: 'white' }}>
        <Switch>
          <Route path="/" exact>
            Home
          </Route>
          <Route path="/queues" component={QueuesIndex} />
          <Route path="/settings" component={Settings} />
          <Redirect to="/" />
        </Switch>
      </Layout.Content>
    </Layout>
  )
}

function AppWrapper() {
  return (
    <Router>
      <CredentialsProvider>
        <HttpProvider>
          <App />
        </HttpProvider>
      </CredentialsProvider>
    </Router>
  )
}

export default AppWrapper
