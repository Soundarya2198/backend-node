import { verifyToken } from "../services/jwt.js";

export const handler = async (event) => {
  try {
    const token = event.authorizationToken.split(" ")[1];
    const decoded = verifyToken(token);

    return {
      principalId: decoded.userId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: "execute-api:Invoke",
            Resource: event.methodArn
          }
        ]
      }
    };
  } catch (err) {
    console.error("Authorizer error:", err);
    throw "Unauthorized";
  }
};
