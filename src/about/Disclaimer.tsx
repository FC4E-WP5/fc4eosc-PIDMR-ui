import { Row } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

function Disclaimer() {
  return (
    <div className="container rounded bg-white mt-1 mb-5">
      <div className="p-4">
        <h3 className="mb-4">
          <FaInfoCircle /> Disclaimer
        </h3>
        <p></p>
          <p className="lead cat-view-lead">
            This disclaimer states the conditions applicable to information on
            the PID Metaresolver (PIDMR) websites and the services
            provided through PID Metaresolver sites.
          </p>
        <Row>
          <h5>Use of the websites</h5>
          <p>
            GRNET and GWDG take the greatest possible care to ensure the
            correctness, completeness and timeliness of the information on the
            PIDMR websites, but it may contain inaccuracies and omissions. GRNET or
            GWDG are not liable for any damage resulting from the use of this
            information, including damage due to incorrectness or incompleteness
            of the Information. 
          </p>
          <h5>Information from Third Parties</h5>
          <p>
            The PIDMR websites may refer to information from third parties, for
            example through links to other websites or training materials. GRNET,
            and GWDG are not liable for this information from third parties.
          </p>

          <h5>Content in addition of Providers</h5>
          <p>
            GRNET and GWDG are not responsible for the content 
            contributed by users of our websites. The intellectual property 
            rights are vested in the publisher addition . GRNET and GWDG
            are not liable for damage resulting from incomplete or incorrect
            information in these additions or reports based on them. GRNET
            and GWDG are also not liable for damage resulting from incorrect
            inferences based on this information.
          </p>
          <p>
            By using the information offered and/ or purchasing services, the
            user declares to agree with the applicability of this disclaimer.
          </p>
          <p>
            Any inaccuracies found or questions about this disclaimer can be
            reported via the Helpdesk.
          </p>
        </Row>
      </div>
    </div>
  );
}

export default Disclaimer;
