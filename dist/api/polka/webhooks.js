import { updateToChirpyRed } from "src/db/queries/chirpy_red.js";
export async function handlerUpgradeUserChirpyRed(req, res) {
    const request = req.body;
    if (request.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    const user = await updateToChirpyRed(request.data.userId);
    if (!user) {
        res.status(404).send();
        return;
    }
    res.status(204).send();
}
