import { Link } from "react-router-dom";
import ROUTES from "../../server/endpoints/routes";
import ladyImage from "../../assets/char1.svg";
import cloudImage from "../../assets/cloud.svg";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist or has been moved</p>
        <img src={ladyImage} alt="404 Not Found" className="not-found-lady" />
        <p>&nbsp;</p>
        <Link to={ROUTES.HOME} className="btn btn-primary btn-lg">
          Return to Homepage
        </Link>
      </div>

      <img
        src={cloudImage}
        alt="404 Not Found"
        className="not-found-cloudsvg"
      />
    </div>
  );
};

export default NotFound;
