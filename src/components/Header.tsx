import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

interface Props {}

function Header(props: Props) {
  return (
    <Navbar fixed='top' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand>Notes App</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
