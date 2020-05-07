import jwt from 'jsonwebtoken';


export const getUserRepos = async (
    githubAppId: number,
    pem: string,
) => {
    const now = Math.floor(Date.now() / 1000);
    const input = {
        // now
        iat: now,
        // expire in 10m
        exp: now + (10 * 60),
        // githubAppId
        iss: githubAppId
      }
    const token = jwt.sign(input, pem);
}