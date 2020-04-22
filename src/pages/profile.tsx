import React from "react";
import withAuth from "../components/molecules/withAuth";

const Profile = ({ user }) => (
  <>
    <h1>Profile</h1>

    <div>
      <h3>Profile (server rendered)</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <a href="https://github.com/apps/meeshkan/installations/new">
        Authenticate your app
      </a>
    </div>
  </>
);

export default withAuth(Profile);
