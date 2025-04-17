import { FaBook, FaGithub } from "react-icons/fa";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import logoGrnet from "@/assets/logo-grnet.png";
import logoGwdg from "@/assets/logo-gwdg.svg";
import logoOpenaire from "@/assets/logo-openaire.png";
import logoINRIA from "@/assets/logo-inria.svg";
import logoUNHEL from "@/assets/logo_UnHel.png";
import logoCSC from "@/assets/logo-CSC.png";
import packageJson from "../../../package.json";

function Footer() {
  // tag build information on footer
  const linksGithub = import.meta.env.VITE_PIDMR_GITHUB;
  const linksDocs = import.meta.env.VITE_PIDMR_DOCS;

  return (
    <footer className="border-top bg-grey-light">
      <Container className="text-left">
        <Row className="mt-4">
          <Col sm>
            <h6>About</h6>
            <ul className="list-unstyled legal">
              <li>
                <Link to="/about/cookies">Cookies Policy</Link>,
              </li>
              <li>
                <Link to="/about/acceptable-use">Acceptable Use Policy</Link>,
              </li>
              <li>
                <Link to="/about/terms">Terms of Use</Link>,
              </li>
              <li>
                <Link to="/about/privacy">Privacy Statement</Link>,
              </li>
              <li>
                <Link to="/about/disclaimer">Disclaimer</Link>
              </li>
            </ul>
          </Col>
          <Col sm>
            <h6>Development</h6>
            <ul className="list-unstyled legal">
              {linksGithub && (
                <li>
                  <FaGithub color="grey" className="me-2" />
                  <a href={linksGithub} target="_blank" rel="noreferrer">
                    Github
                  </a>
                </li>
              )}
              {linksDocs && (
                <li>
                  <FaBook color="grey" className="me-2" />
                  <a href={linksDocs} target="_blank" rel="noreferrer">
                    Documentation
                  </a>
                </li>
              )}
              <li>
                <br />
                Version: <strong>{packageJson.version}</strong>
              </li>
            </ul>
          </Col>
          <Col sm>
            <Row>
              <Col>
                <a
                  href="https://www.grnet.gr/en"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img className="pidmr-logo-xsm" src={logoGrnet} alt="GRNET" />
                </a>
                <a href="https://www.gwdg.de/" target="_blank" rel="noreferrer">
                  <img className="pidmr-logo-xsm" src={logoGwdg} alt="GWDG" />
                </a>

                <a
                  href="https://www.openaire.eu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="pidmr-logo-xsm"
                    src={logoOpenaire}
                    alt="OPENAIRE"
                  />
                </a>
              </Col>
            </Row>
            <Row>
              <Col>
                <a
                  href="https://www.csc.fi/en"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img className="pidmr-logo-xsm" src={logoCSC} alt="CSC" />
                </a>

                <a
                  href="https://www.inria.fr/en"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="pidmr-logo-xsm"
                    src={logoINRIA}
                    alt="Institut national de recherche en sciences et technologies du numérique"
                  />
                </a>
                <a
                  href="https://www.helsinki.fi/en"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="pidmr-logo-xsm"
                    src={logoUNHEL}
                    alt="University of Helsinki"
                  />
                </a>
              </Col>
            </Row>
            <Row>
              <Col>&nbsp;</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export { Footer };
