import React from "react";
import {} from "@chakra-ui/core";
import { useFetchUser } from "../utils/user";
import Layout from "../components/layout";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useFetchUser();

  return (
    // @ts-ignore
    <Layout user={user}>
      {!loading && (
        <section>
          {!user && (
            <p>
              <a href="/api/login">Login</a>
            </p>
          )}
          {user && (
            <div>
              <Link href="/dashboard">
                <a>Dashboard</a>
              </Link>
              <a href="/api/logout">Logout</a>
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}
