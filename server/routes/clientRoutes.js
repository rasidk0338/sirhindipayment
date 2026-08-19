import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  searchClients,
  updateClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Client name is required"),
    body("mobile").trim().notEmpty().withMessage("Client mobile is required"),
  ],
  createClient,
);
router.get("/", getClients);
router.get("/search", searchClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
