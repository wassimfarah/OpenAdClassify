'use client'

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { setLoggedIn, clearUser } from '../../Redux/authSlice';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { apiRequest } from '../../utils/axiosApiRequest'; // Import the apiRequest function

function NavScrollExample() {
  const { loggedIn, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Make POST request to the logout endpoint
      await apiRequest({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_URL_BACKEND_LOGOUT}`, // Use the environment variable
        useCredentials: true,
      });
      // Update Redux state after successful logout
      dispatch(setLoggedIn(false));
      dispatch(clearUser());
      window.location.replace('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/" as={Link}>Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/" as={Link}>Home</Nav.Link>
            <Nav.Link href="/help" as={Link}>Help</Nav.Link>
            <Nav.Link href="/messages" as={Link}>Messages</Nav.Link>
          </Nav>

          {/* Centered Create Ad Dropdown */}
          <div className="flex justify-center w-full mb-2 lg:mb-0">
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic" className="bg-gray-800 border-0">
                Create Ad
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/createAd/sell">Sell</Dropdown.Item>
                <Dropdown.Item href="/createAd/seek">Seek</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/createAd/donate">Donate</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Preferences */}
          <Nav className="d-flex">
            {loggedIn && user ? (
              <>
                <NavDropdown align="end" title={`Welcome, ${user.username}`} id="user-dropdown">
                  <NavDropdown.Item as={Link} href="/ads-history">
                    Ads History
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} href="/register">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} href="/login" className="mr-12">
                  Login
                </Nav.Link>
              </>
            )}
            <NavDropdown align="end" title="⚙️" id="preferences-dropdown">
              <NavDropdown.Item>
                {/* Language Switcher */}
                  <Link href="/" locale="en">Language</Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                {/* Theme Switcher */}
                <div>
                  <input type="checkbox" id="theme-switch" />
                  <label htmlFor="theme-switch">Toggle Theme</label>
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
