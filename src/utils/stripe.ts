import Stripe from "stripe";

import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import { flow, constant, constNull, constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import * as Ord from "fp-ts/lib/Ord";
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as _E from "../fp-ts/Either";
import * as _RTE from "../fp-ts/ReaderTaskEither";
import { NonEmptyArray, groupSort } from "fp-ts/lib/NonEmptyArray";
import { LensTaskEither, lensTaskEitherHead } from "../monocle-ts";
import { eightBaseClient } from "./graphql";
import { UPDATE_STRIPE_ID_MUTATION } from "../gql/pages/[teamName]/plan";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";

export const stripe = (): Stripe =>
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-03-02",
  });

export const createCustomerId = (id: string, teamName: string) => (
  session: ISession
) =>
  pipe(
    TE.tryCatch(
      () =>
        stripe().customers.create({
          metadata: {
            teamId: id,
          },
        }),
      () => ({
        type: "STRIPE_ERROR",
        msg: "Could not create a stripe customer",
      })
    ),
    TE.chain((res) =>
      TE.tryCatch(
        () =>
          eightBaseClient(session)
            .request(UPDATE_STRIPE_ID_MUTATION, {
              userId: id,
              teamName,
              stripeCustomerId: res.id,
            })
            .then((_) => Promise.resolve(res.id)),
        () => ({
          type: "UPDATE_PLAN_ERROR",
          msg: "Could not update plan on 8base",
        })
      )
    )
  );

export const NO_PLAN = "NO_PLAN";
export const FREE_PLAN = "FREE_PLAN";
export const PREMIUM_PLAN = "PREMIUM_PLAN";
export const BUSINESS_PLAN = "BUSINESS_PLAN";

export const titleToPlan = {
  Free: FREE_PLAN,
  Pro: PREMIUM_PLAN,
  Business: BUSINESS_PLAN,
};

export const planToTitle = {
  [FREE_PLAN]: "Free",
  [PREMIUM_PLAN]: "Pro",
  [BUSINESS_PLAN]: "Business",
};

const FREE_PRODUCTS = ["prod_HrwlJoI1FAweM7", "prod_HTfEj9GbQlxC2s"];
const PREMIUM_PRODUCTS = ["prod_HTfdd1W68BaTZM", "prod_Hrwkz4u8sEBipZ"];
const BUSINESS_PRODUCTS = ["prod_HTfeQicQmWGrsf", "prod_Hrx9uCdMeNNFHN"];

const foldOr = A.foldLeft(
  () => false,
  (a, b) => a || foldOr(b)
);
const checkPlan = (response: string) =>
  flow(
    A.map<string, boolean>((t) => response.indexOf(t) >= 0),
    foldOr
  );
const _getPlan = (response: string): string =>
  checkPlan(response)(BUSINESS_PRODUCTS)
    ? BUSINESS_PLAN
    : checkPlan(response)(PREMIUM_PRODUCTS)
    ? PREMIUM_PLAN
    : checkPlan(response)(FREE_PRODUCTS)
    ? FREE_PLAN
    : NO_PLAN;

export const getPlan = flow(JSON.stringify, _getPlan);

export const createPlanIfNoPlan = (customer: string) => (plan: string) =>
  plan !== NO_PLAN
    ? TE.right(plan)
    : TE.tryCatch(
        () =>
          stripe()
            .subscriptions.create({
              customer,
              items: [{ price: process.env.STRIPE_FREE_PLAN_PRICE }],
            })
            .then((_) => FREE_PLAN),
        (err) => ({
          type: "STRIPE_ERROR",
          msg: JSON.stringify(err),
        })
      );
