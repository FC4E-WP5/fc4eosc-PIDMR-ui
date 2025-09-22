import { lazy } from "react";
import { Container, Navbar } from "react-bootstrap";

const Navigation = lazy(() => import("../../common/components/Navigation"));

const Header = () => {
  return (
    <Navbar data-bs-theme="light" expand="lg" className="main-nav shadow-sm">
      <Container>
        <Navigation />
      </Container>
    </Navbar>
  );
};

export default Header;
