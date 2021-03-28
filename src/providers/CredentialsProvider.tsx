import React, { FC } from 'react'
import useLocalStorage from 'use-local-storage'

export const CredentialsContext = React.createContext<{
  baseUrl: string
  setBaseUrl: (uri: string) => void
  username: string
  setUsername: (username: string) => void
  password: string
  setPassword: (password: string) => void
  logout: () => void
}>({
  baseUrl: '',
  setBaseUrl: () => null,
  username: '',
  setUsername: () => null,
  password: '',
  setPassword: () => null,
  logout: () => null,
})

export const CredentialsProvider: FC = ({ children }) => {
  const [baseUrl, setBaseUrl] = useLocalStorage(
    'baseUrl',
    'http://localhost:8010'
  )
  const [username, setUsername] = useLocalStorage('username', 'guest')
  const [password, setPassword] = useLocalStorage('password', 'guest')

  return (
    <CredentialsContext.Provider
      value={{
        baseUrl,
        setBaseUrl,
        username,
        setUsername,
        password,
        setPassword,
        logout: () => {
          setUsername('')
          setPassword('')
        },
      }}
    >
      {children}
    </CredentialsContext.Provider>
  )
}
