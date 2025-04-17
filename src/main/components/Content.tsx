import { Container } from "react-bootstrap";
import Header from "./Header";
import Routes from "./Routes";
import { Footer } from "./Footer";

const Content = () => {
  return (
    <>
      <Header />
      <Container
        className="d-flex flex-column flex-grow-1"
        style={{ width: "110vh" }}
      >
        <Routes />
      </Container>
      <Footer />
    </>
  );
};

export default Content;
