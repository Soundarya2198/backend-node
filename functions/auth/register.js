import { PutCommand } from "@aws-sdk/lib-dynamodb";
import ddb from "../../services/dynamo.js";
import { hashPassword } from "../../utils/hash.js";
import { v4 as uuidv4 } from "uuid";
import response from "../../utils/response.js";

export const register = async (event) => {
    try{

    const {email, password, name} = JSON.parse(event.body);

    if( !email || !password || !name) {
       response(400, { message: "Name, email and password are required." });
    }

    const hashedPassword = await hashPassword(password);

    const user = {
        userId: uuidv4(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
    }
   
    const result = await ddb.send( new PutCommand({
        TableName: process.env.USERS_TABLE,
        Item: user,
    }))

    if(result.$metadata.httpStatusCode === 200) {
       return response(201, { message: "User registered successfully." });
    }else {
       return response(500, { message: "Could not register user." });
    }
}catch(e){
    console.error("Error registering user: ", e);
    return response(500, { message: "Internal server error.", msg: e.message });
}
}