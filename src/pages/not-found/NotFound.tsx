import { Link } from "react-router-dom";
import ROUTES from "../../server/endpoints/routes";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved</p>
        <img
          src="https://faircore4eosc.eu/themes/faircore/images/graphic/char1.svg"
          alt="404 Not Found"
          className="not-found-lady"
        />
        <p>&nbsp;</p>
        <Link to={ROUTES.HOME} className="btn btn-primary btn-lg">
          Return to Homepage
        </Link>
      </div>

      <img
        src="https://faircore4eosc.eu/themes/faircore/images/graphic/cloud.svg"
        alt="404 Not Found"
        className="not-found-cloudSvg"
      />
    </div>
  );
};

export default NotFound;
