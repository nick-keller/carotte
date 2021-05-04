import React from 'react'
import parseUrl from 'url-parse'

export enum ConnectionStatus {
  LOADING,
  NO_BASE_URL,
  NETWORK_ERROR,
  RESPONSE_ERROR,
  UNEXPECTED_RESPONSE,
  BAD_CREDENTIALS,
  OK,
}

export const checkConnection = async ({
  baseUrl,
  username,
  password,
}: {
  baseUrl: string
  username: string
  password: string
}): Promise<ConnectionStatus> => {
  if (!baseUrl) {
    return ConnectionStatus.NO_BASE_URL
  }

  try {
    const [auth, whoami] = await Promise.all([
      fetch(`https://carotte-proxy.vercel.app/api?url=${baseUrl}/api/auth`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }),
      fetch(`https://carotte-proxy.vercel.app/api?url=${baseUrl}/api/whoami`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }),
    ])

    if (!auth.ok) {
      return ConnectionStatus.RESPONSE_ERROR
    }

    try {
      await auth.json()
    } catch (error) {
      return ConnectionStatus.UNEXPECTED_RESPONSE
    }

    if (!whoami.ok) {
      return ConnectionStatus.BAD_CREDENTIALS
    }

    return ConnectionStatus.OK
  } catch (error) {
    return ConnectionStatus.NETWORK_ERROR
  }
}

export const connectionStatusText = (status: ConnectionStatus) => {
  if (status === ConnectionStatus.NETWORK_ERROR) {
    return (
      <>
        Either the host is not reachable, or it does not accept requests from{' '}
        <b>{parseUrl(window.location.pathname).host}</b> (CORS).{' '}
        <a href="https://github.com/nick-keller/carotte#cors-issues">
          How to fix?
        </a>
      </>
    )
  }

  if (status === ConnectionStatus.RESPONSE_ERROR) {
    return 'The host responded with an error, this is not a credential error.'
  }

  if (status === ConnectionStatus.UNEXPECTED_RESPONSE) {
    return 'The host responded in an unexpected format.'
  }

  if (status === ConnectionStatus.BAD_CREDENTIALS) {
    return 'Incorrect username or password.'
  }

  return null
}
