import { Router } from "express";
import searchTracks from "../controllers/tracks.controller.js";

const router = Router();
router.get("/search", searchTracks);

export default router;