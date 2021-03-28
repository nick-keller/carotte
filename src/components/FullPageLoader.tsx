import React, { FC } from 'react'
import { Spin } from 'antd'
import { Box } from '@xstyled/styled-components'

export const FullPageLoader: FC = () => {
  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spin size="large" />
    </Box>
  )
}
