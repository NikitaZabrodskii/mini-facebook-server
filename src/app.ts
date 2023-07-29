import express, { Express } from "express";

export class App {
  app: Express;
  constructor() {
    this.app = express();
  }
}
