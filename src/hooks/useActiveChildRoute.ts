import { useLocation, useRouteMatch } from 'react-router-dom'

export const useActiveChildRoute =  () => {
  const { pathname } = useLocation()
  const match = useRouteMatch()

  const [ activeChildRoute] = pathname.slice(pathname[match.url.length] === '/' ? match.url.length + 1 : match.url.length).split('/')

  return '/' + activeChildRoute
}
