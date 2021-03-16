import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import requestMethods from "./requestMethods";
import cors from "./cors";
import bodyParser from "./bodyParser";

export default (app) => {
  app.use(requestMethods);
  app.use(compression());
  app.use(favicon("public/favicon.ico"));
  app.use(express.static("public"));
  app.use(cors);
  app.use(bodyParser);
  app.use(cookieParser());
};
