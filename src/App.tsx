import React, { useContext } from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreOutlined,
  BuildOutlined,
  LogoutOutlined,
  UserOutlined,
  PartitionOutlined,
  SwapOutlined,
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
import { CheckConnection } from './pages/auth/CheckConnection'
import { useActiveChildRoute } from './hooks/useActiveChildRoute'
import GithubCorner from 'react-github-corner'
import { ExchangesIndex } from './pages/exchanges'
import { RoutingIndex } from './pages/routing'

function App() {
  const { username, logout } = useContext(CredentialsContext)
  const activeRoute = useActiveChildRoute()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider breakpoint="lg" collapsedWidth="0">
        <Menu theme="dark" selectedKeys={[activeRoute]}>
          <Menu.Item icon={<AppstoreOutlined />} key="/" disabled>
            <Link to="/">Overview</Link>
          </Menu.Item>
          <Menu.Item icon={<BuildOutlined />} key="/queues">
            <Link to="/queues">Queues</Link>
          </Menu.Item>
          <Menu.Item icon={<PartitionOutlined />} key="/exchanges">
            <Link to="/exchanges">Exchanges</Link>
          </Menu.Item>
          <Menu.Item icon={<SwapOutlined />} key="/routing">
            <Link to="/routing">Routing</Link>
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
          <Route path="/exchanges" component={ExchangesIndex} />
          <Route path="/routing" component={RoutingIndex} />
          <Redirect to="/queues" />
        </Switch>
      </Layout.Content>
    </Layout>
  )
}

function AppWrapper() {
  return (
    <>
      <Router>
        <CredentialsProvider>
          <HttpProvider>
            <CheckConnection>
              <App />
            </CheckConnection>
          </HttpProvider>
        </CredentialsProvider>
      </Router>
      <GithubCorner href="https://github.com/nick-keller/carotte" size={50} />
    </>
  )
}

export default AppWrapper
