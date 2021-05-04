import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-demo/layout/link';

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          About
        </Typography>
        <Button variant="contained" color="primary" component={Link} naked href="/">
          Go to the main page
        </Button>
      </Box>
    </Container>
  );
}
