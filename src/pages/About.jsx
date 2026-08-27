import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import pkg from '../../package.json'

export default function About() {
  return (
    <Box sx={{ color: 'text.primary', p: 4, maxWidth: 800 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        About This Project
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome! This tiny site explores a moody navy-themed UI with a responsive
        radial background that follows your mouse. It's designed to be minimal,
        atmospheric, and just a little bit playful — like a paper boat on a midnight sea.
      </Typography>
      <Typography variant="body1" paragraph>
        Built with React and MUI, it demonstrates a custom dark palette tuned to deep
        navy blues, subtle translucency, and accessible typography. The goal is to
        provide a calm, readable canvas for future content.
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        App version: {pkg.version}
      </Typography>
    </Box>
  )
}
