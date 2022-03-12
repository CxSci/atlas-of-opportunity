import { styled } from '@mui/material/styles'

const Anchor = styled('div')(({ theme }) => {
  console.log({ theme })
  return {
    position: 'relative',
    visibility: 'hidden',
    top: -120,
  }
})

export default Anchor
