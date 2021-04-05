import React from 'react'
import parseUrl from 'url-parse'

export enum ConnexionStatus {
  LOADING,
  NO_BASE_URL,
  NETWORK_ERROR,
  RESPONSE_ERROR,
  UNEXPECTED_RESPONSE,
  BAD_CREDENTIALS,
  OK,
}

export const checkConnexion = async ({
  baseUrl,
  username,
  password,
}: {
  baseUrl: string
  username: string
  password: string
}): Promise<ConnexionStatus> => {
  if (!baseUrl) {
    return ConnexionStatus.NO_BASE_URL
  }

  try {
    const [auth, whoami] = await Promise.all([
      fetch(`${baseUrl}/api/auth`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }),
      fetch(`${baseUrl}/api/whoami`, {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }),
    ])

    if (!auth.ok) {
      return ConnexionStatus.RESPONSE_ERROR
    }

    try {
      await auth.json()
    } catch (error) {
      return ConnexionStatus.UNEXPECTED_RESPONSE
    }

    if (!whoami.ok) {
      return ConnexionStatus.BAD_CREDENTIALS
    }

    return ConnexionStatus.OK
  } catch (error) {
    return ConnexionStatus.NETWORK_ERROR
  }
}

export const connexionStatusText = (status: ConnexionStatus) => {
  if (status === ConnexionStatus.NETWORK_ERROR) {
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

  if (status === ConnexionStatus.RESPONSE_ERROR) {
    return 'The host responded with an error, this is not a credential error.'
  }

  if (status === ConnexionStatus.UNEXPECTED_RESPONSE) {
    return 'The host responded in an unexpected format.'
  }

  if (status === ConnexionStatus.BAD_CREDENTIALS) {
    return 'Incorrect username or password.'
  }

  return null
}
