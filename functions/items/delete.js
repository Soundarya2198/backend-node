import ddb from "../../services/dynamo.js";
import response from "../../utils/response.js";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const deleteItem = async (event) => {
    try {
        const itemId = event.pathParameters.itemId;

        if (!itemId) {
            return response(400, { message: "Item ID is required." });
        }    
        const getResult = await ddb.send(
            new GetCommand({
                TableName: process.env.ITEMS_TABLE,
                Key: { itemId: itemId },
            })
        );   
        if (!getResult.Item) {
            return response(404, { message: "Item not found." });
        }
        const deleteResult = await ddb.send(
            new DeleteCommand({
                TableName: process.env.ITEMS_TABLE,
                Key: { itemId: itemId },
            })
        );
        return response(200, { message: "Item deleted successfully." });
    } catch (e) {
        console.error("Error deleting item: ", e);
        return response(500, {
            message: "Internal server error",
            msg: e.message,
        });
    }   
};    