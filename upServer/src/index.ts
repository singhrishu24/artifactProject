import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import {generate} from "./genRandom";
import path from "path";
import {getAllFiles} from "./getFiles";
import {uploadFile} from "./awsUpload";
import { createClient} from "redis";

const publisher = createClient({
    socket: {
        port : 6379,
        host : "127.0.0.1",
    }
});
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());

// POSTMAN 
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
    // __dirname for absolute paths 

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    console.log(files);
    
    // put in s3

    files.forEach(async file => {
        let relFilePath = file.slice(path.join(__dirname, `output/${id}`).length+1);
        relFilePath = relFilePath.replace(/\\/g, '/');
        // NOTE : the "\\" needs to be changed to '/' for the server to understand that a dir needs to created. 
        const s3Key = `output/${id}/${relFilePath}`;
        await uploadFile(s3Key, file);
    })

    publisher.lPush("build-queue", id);
    
    res.json({
        id : id
    })
});

app.listen(3000);