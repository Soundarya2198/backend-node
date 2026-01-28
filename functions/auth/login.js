import ddb from "../../services/dynamo.js";
import { comparePassword } from "../../utils/hash.js";
import {QueryCommand} from "@aws-sdk/lib-dynamodb";
import response from "../../utils/response.js";
import { generateToken } from "../../services/jwt.js";

export const login = async (event) => {
    try{
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
        return response(400, { message: "Email and password are required." });
    }

    const result = await ddb.send(
      new QueryCommand({
        TableName: process.env.USERS_TABLE,
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
        Limit: 1,
      })
    );
    if (!result.Items || result.Items.length === 0) {
      return response(401, { message: "Invalid email or password." });
    }

    const user = result.Items[0];

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        return response(401, { message: "Invalid email or password." });
    }
    const token = generateToken({ userId: user.userId, email: user.email, name: user.name });

    return response(200, { token, user: { userId: user.userId, name: user.name, email: user.email } });
}
catch(e){
    console.error("Error logging in user: ", e);
    return response(500, { message: "Internal server error.", msg: e.message });
}
}
