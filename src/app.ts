import express, { type Express } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

export const app: Express = express();

/**
 * Middlewares
 */
app.use(express.json());
app.use(errorHandler);
