const { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { config } = require('./api/config/config');
const fs = require('fs');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const client = new S3Client({
  region: config.aws_region,
  credentials: {
    accessKeyId: config.aws_key,
    secretAccessKey: config.aws_secret
  }
});



async function uploadFile(file){
  const url = `https://lab-clinico-aws.s3.amazonaws.com/lab-clinico_${file.name}`
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: config.aws_name,
    Key: file.name,
    Body: stream
  }
  const command = new PutObjectCommand(uploadParams);
  await client.send(command);
  const command1 = new GetObjectCommand({
    Bucket: config.aws_name,
    Key: file.name
  })
  return await getSignedUrl(client, command1, { expiresIn: 604799 });

}

async function getFiles(){
  const command = new ListObjectsCommand({
    Bucket: config.aws_name
  })
  return await client.send(command);
}

async function getFile(fileName){
  const command = new GetObjectCommand({
    Bucket: config.aws_name,
    Key: fileName
  })
  return await client.send(command);
}

async function downloadFile(fileName){
  const command = new GetObjectCommand({
    Bucket: config.aws_name,
    Key: fileName
  })
  const result = await client.send(command);
  console.log(result)
  result.Body.pipe(fs.createWriteStream(`./documents/${fileName}`))
}

async function getFileURL(fileName){
  const command = new GetObjectCommand({
    Bucket: config.aws_name,
    Key: fileName
  })
  return await getSignedUrl(client, command, { expiresIn: 604799 });
}

module.exports = { uploadFile, getFiles, getFile, downloadFile, getFileURL };