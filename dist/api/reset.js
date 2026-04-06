import { config } from "../config.js";
import { ForbiddenError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";
export async function handlerReset(req, res) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError(`Forbidden`);
    }
    await deleteUsers();
    config.api.fileServerHits = 0;
    res.send("OK hits were reset");
}
