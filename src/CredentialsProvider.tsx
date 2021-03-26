import React, { FC } from 'react';
import useLocalStorage from 'use-local-storage'

export const CredentialsContext = React.createContext<{
  uri: string
  setUri: (uri: string) => void
  username: string
  setUsername: (username: string) => void
  password: string
  setPassword: (password: string) => void
}>({
  uri: '',
  setUri: () => null,
  username: '',
  setUsername: () => null,
  password: '',
  setPassword: () => null,
})

export const CredentialsProvider: FC = ({ children }) => {
  const [ uri, setUri ] = useLocalStorage('uri', 'http://localhost:8010')
  const [ username, setUsername ] = useLocalStorage('username', 'guest')
  const [ password, setPassword ] = useLocalStorage('password', 'guest')

  return (
    <CredentialsContext.Provider value={{ uri, setUri, username, setUsername, password, setPassword }}>
      {children}
    </CredentialsContext.Provider>
  )
}
