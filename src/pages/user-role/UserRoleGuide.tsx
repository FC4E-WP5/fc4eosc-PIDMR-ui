import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const UserRoleGuide: React.FC = () => {
  return (
    <div className="mt-4 mb-4">
      <h5>
        <FaInfoCircle className="me-2" />
        Role Change Guide
      </h5>
      <div className="container mt-3">
        <h3 className="mb-4">
          Step-by-Step Guide to Request Role Promotion to Provider Admin
        </h3>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Step 1: Login to the site</h5>
            <p className="card-text">
              1. Click the <strong>Login</strong> button
              <br />
              2. Enter your username and password in the login form.
              <br />
              3. Click the <strong>Sign in</strong> button.
            </p>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              Step 2: Access the Role Promotion Request Form & Fill the Form
            </h5>
            <p className="card-text mb-0">
              1. Once logged in, you will be brought to the{" "}
              <strong>Request Role Promotion</strong> page.
              <br />
              2. You will see a form with the following fields:
            </p>
            <ul className="m-1">
              <li>
                <strong>Name:</strong> Enter your first name.
              </li>
              <li>
                <strong>Surname:</strong> Enter your surname.
              </li>
              <li>
                <strong>Email:</strong> Enter your email address.
              </li>
              <li>
                <strong>Description:</strong> Provide a short description
                explaining why you are requesting the role promotion, please add
                any info that you find relevant.
              </li>
            </ul>
            <p className="card-text">3. Fill Out the Form</p>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Step 3: Submit the Form</h5>
            <p className="card-text">
              1. After filling out all the fields, click the{" "}
              <strong>Submit</strong> button to send your request.
              <br />
              2. If you decide not to submit the request, you can click the{" "}
              <strong>Cancel</strong> button to discard the form.
            </p>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Step 4: Wait for Admin Approval</h5>
            <p className="card-text">
              1. Your request will be reviewed by the site admin.
              <br />
              2. You will be able to check the status of your request as{" "}
              <strong>pending</strong>, <strong>approved</strong> or{" "}
              <strong>rejected</strong>.
              <br />
              3. The initial status of your request will be marked as{" "}
              <strong>pending</strong>.
            </p>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Step 5: Check Your Request Status</h5>
            <p className="card-text">
              1. Each time you log in to the site, you can check the status of
              your role promotion request.
              <br />
              2. You can navigate to other open pages or even close the page.
              Once you login you will view the current status of your
              application.
              <br />
              3. Once the request is approved you will see that you have the
              role of <strong>provider_admin</strong> at the top of the page.
              <br />
              4. In case your request was rejected, please contact the following
              email <strong>pidmr@einfra.grnet.gr</strong> for more information.
            </p>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Additional Notes</h5>
            <p className="card-text">
              - Ensure all the details you provide are accurate and complete to
              facilitate a smooth review process.
              <br />- If you have any questions or need further assistance, you
              can reach out to the support team using the following email{" "}
              <strong>pidmr@einfra.grnet.gr</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleGuide;
