"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = 8000;
    }
    init() {
        this.server = this.app.listen(this.port);
        console.log("server started");
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map