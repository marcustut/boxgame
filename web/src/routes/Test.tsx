import { styled } from '@mui/material'
import React from 'react'

const Root = styled('div')`
  background-color: #990000;
  height: 100vh;
  width: 100vw;
`

export const Test: React.FC = () => {
  console.warn('玩玩啊你以为！🥲\n你离真相很靠近了，你只需要把你所看到的颜色数字化（转换成16进制代码）')
  return <Root />
}
