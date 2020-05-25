import { NextApiRequest, NextApiResponse } from "next";
////// request response

export const mockRequest = (): NextApiRequest => ({} as NextApiRequest);
export const mockResponse = (): NextApiResponse =>
  // @ts-ignore
  ({ status: jest.fn(), end: jest.fn() } as NextApiResponse);
