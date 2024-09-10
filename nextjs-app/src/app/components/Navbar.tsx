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
import { resetPendingMessageCount } from '@/Redux/pendingMessageSlice';
import styles from './styles/Navbar.module.css';
import { useRouter, usePathname } from 'next/navigation';

function NavScrollExample() {
  const { loggedIn, user } = useSelector((state: RootState) => state.auth);
  const receivedMessagesCount = useSelector((state: RootState) => state.message.pendingMessageCount); // Select receivedMessagesCount from Redux
  const router = useRouter(); 
  const pathname = usePathname();

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

  const handleMessagesClick = async () => {
    try {
      // Reset received messages count on the backend
      await apiRequest({
        method: 'PATCH',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL_RESET_PENDING_MESSAGES_COUNT}`, 
        useCredentials: true,
      });

      // Reset the pending message count in Redux
      dispatch(resetPendingMessageCount());
    } catch (error) {
      console.error('Failed to reset pending message count:', error.message);
    }
  };

  return (
    <Navbar expand="lg" className={styles.navbarContainer}>
      <Container fluid>
        <Navbar.Brand href="/" as={Link} className={styles.navbarBrand}>OpenAdClassify</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link 
              href="/" 
              as={Link}
              className={pathname === '/' ? styles.activeLink : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link href="/" as={Link} className={pathname === '/help' ? styles.activeLink : ''}>
              Help
            </Nav.Link>
            {
            loggedIn && user ?
            <Nav.Link 
            href="/messages" 
            as={Link} 
            onClick={handleMessagesClick}
            style={{
              color: receivedMessagesCount > 0 ? 'red' : 'inherit',
              fontWeight: receivedMessagesCount > 0 ? 'bold' : 'normal',
            }}
            className={`${styles.navbarLink} ${pathname === '/messages' ? styles.activeLink : ''}`}

          >
            Messages
            {receivedMessagesCount > 0 && (
              <span className={styles.messageCount}>({receivedMessagesCount})</span>
            )}
          </Nav.Link>
          : null
          }


          </Nav>

          {/* Centered Create Ad Dropdown */}
          <div className="flex justify-center w-full mb-2 lg:mb-0">
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic" className="bg-gray-800 border-0">
                Create Ad
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/createAd/sell"> 🛒 Sell</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/createAd/donate">❤️ Donate</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Preferences */}
          <Nav className="d-flex">
            {loggedIn && user ? (
              <>
                <NavDropdown align="end" title={`Welcome, ${user.username}`} id="user-dropdown">
                  <NavDropdown.Item as={Link} href="/ads-history">
                  📜 Ads History
                  </NavDropdown.Item>
                  <Dropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                  🔓 Logout
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
                🌐 Language
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
               🌙 Theme
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
