import {S3} from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId : "AKIA3FLDYGRDLMW75RGL",
    secretAccessKey : "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"
})


// fileName : to where it has to be uploaded 
// filePath : the local filePath 

export const uploadFile = async (fileName: string, localFilePath: string) => {
    //console.log("called");
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "artfact-man-boiler-test",
        Key: fileName, //where to put in the bucket 
    }).promise();
    console.log(response)
}