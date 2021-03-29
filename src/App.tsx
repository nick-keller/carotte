import React, { useContext } from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreOutlined,
  BuildOutlined,
  LogoutOutlined,
  UserOutlined,
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
import { useActiveChildRoute } from './hooks/useActiveChildRoute'
import GithubCorner from 'react-github-corner'

function App() {
  const { username, logout } = useContext(CredentialsContext)
  const activeRoute = useActiveChildRoute()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider>
        <Menu theme="dark" selectedKeys={[activeRoute]}>
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
      <GithubCorner href="https://github.com/nick-keller/carotte" size={50} />
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
