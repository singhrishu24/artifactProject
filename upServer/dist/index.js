"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const genRandom_1 = require("./genRandom");
const path_1 = __importDefault(require("path"));
const getFiles_1 = require("./getFiles");
const awsUpload_1 = require("./awsUpload");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)({
    socket: {
        port: 6379,
        host: "127.0.0.1",
    }
});
publisher.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// POSTMAN 
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    const id = (0, genRandom_1.generate)();
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    // __dirname for absolute paths 
    const files = (0, getFiles_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    console.log(files);
    // put in s3
    files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
        let relFilePath = file.slice(path_1.default.join(__dirname, `output/${id}`).length + 1);
        relFilePath = relFilePath.replace(/\\/g, '/');
        // NOTE : the "\\" needs to be changed to '/' for the server to understand that a dir needs to created. 
        const s3Key = `output/${id}/${relFilePath}`;
        yield (0, awsUpload_1.uploadFile)(s3Key, file);
    }));
    publisher.lPush("build-queue", id);
    res.json({
        id: id
    });
}));
app.listen(3000);
