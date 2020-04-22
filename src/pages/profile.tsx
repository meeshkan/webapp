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

// export async function getServerSideProps({ req, res }) {
//   // Here you can check authentication status directly before rendering the page,
//   // however the page would be a serverless function, which is more expensive and
//   // slower than a static page with client side authentication
//   const { user } = await auth0.getSession(req);

//   if (!user) {
//     res.writeHead(302, {
//       Location: "/api/login",
//     });
//     res.end();
//     return;
//   }

//   return { props: { user } };
// }

export default withAuth(Profile);
