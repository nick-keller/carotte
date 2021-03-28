import React, { useContext } from 'react'
import { Layout, Menu, Dropdown, Avatar, Space } from 'antd'
import {
  AppstoreOutlined,
  BuildOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import {
  CredentialsContext,
  CredentialsProvider,
} from './providers/CredentialsProvider'
import { HttpProvider } from './providers/HttpProvider'
import { QueuesIndex } from './pages/queues'
import { CheckBaseUrl } from './pages/auth/CheckBaseUrl'
import { CheckCredentials } from './pages/auth/CheckCredentials'
import { Box } from '@xstyled/styled-components'

function App() {
  const { username, logout } = useContext(CredentialsContext)

  const userMenu = (
    <Menu>
      <Menu.Item icon={<AppstoreOutlined />} key="logout">
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider>
        <Menu theme="dark">
          <Menu.Item icon={<AppstoreOutlined />} key="/" disabled>
            <Link to="/">Overview</Link>
          </Menu.Item>
          <Menu.Item icon={<BuildOutlined />} key="/queues">
            <Link to="/queues">Queues</Link>
          </Menu.Item>
          <Menu.SubMenu icon={<UserOutlined />} key="user" title={username}>
            <Menu.Item icon={<LogoutOutlined />} key="logout" onClick={logout}>
              Logout
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Layout.Sider>
      <Layout.Content style={{ background: 'white' }}>
        <Switch>
          <Route path="/queues" component={QueuesIndex} />
          <Redirect to="/queues" />
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
          <CheckBaseUrl>
            <CheckCredentials>
              <App />
            </CheckCredentials>
          </CheckBaseUrl>
        </HttpProvider>
      </CredentialsProvider>
    </Router>
  )
}

export default AppWrapper
