import * as AWS from "aws-sdk";
import { createReadStream } from "fs";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (file: any, userId: any, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "jang-instaclone-uploader",
      Key: objectName, //file name,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};
