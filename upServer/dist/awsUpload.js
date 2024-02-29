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
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "AKIA3FLDYGRDLMW75RGL",
    secretAccessKey: "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"
});
// fileName : to where it has to be uploaded 
// filePath : the local filePath 
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("called");
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "artfact-man-boiler-test",
        Key: fileName, //where to put in the bucket 
    }).promise();
    console.log(response);
});
exports.uploadFile = uploadFile;
