// Add additional methods to console
import "./console";

// Configure environment file (.env)
import dotenv from "dotenv";
dotenv.config();

// Start server
import express from "express";
import server from "./server";
server(express());

// Initialize discord bot
import bot from "./bot";
import { Client } from "discord.js";
bot(new Client);
