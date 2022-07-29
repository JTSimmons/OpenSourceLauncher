const S3 = require("aws-sdk/clients/s3.js");
const path = require("path");
const fs = require("fs");

const s3 = new S3({
  endpoint: "",
  accessKeyId: "",
  secretAccessKey:
    "",
  signatureVersion: "v4",
});

const uploadDir = function (s3Path, bucketName) {
  function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
      var filePath = path.join(currentDirPath, name);
      var stat = fs.statSync(filePath);
      if (stat.isFile()) {
        callback(filePath, stat);
      } else if (stat.isDirectory()) {
        walkSync(filePath, callback);
      }
    });
  }

  walkSync(s3Path, function (filePath, stat) {
    let bucketPath = filePath.substring(s3Path.length);
    let params = {
      Bucket: bucketName,
      Key: bucketPath,
      Body: fs.readFileSync(filePath),
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(
          "Successfully uploaded " + bucketPath + " to " + bucketName
        );
      }
    });
  });
};

const config = JSON.parse(fs.readFileSync("./src-tauri/tauri.conf.json"));

const latest_json = JSON.stringify({
  version: config.package.version,
  notes: "Test version",
  pub_date: new Date().toISOString(),
  platforms: {
    "windows-x86_64": {
      signature: fs.readFileSync(
        `src-tauri\\target\\release\\bundle\\msi\\${config.package.productName}_${config.package.version}_x64_en-US.msi.zip.sig`, 'utf8'
      ),
      url: `https://file-service-worker.worlds-embrace.workers.dev/${config.package.productName}_${config.package.version}_x64_en-US.msi.zip`,
    },
  },
});

uploadDir("src-tauri\\target\\release\\bundle\\msi\\", "game-launcher");

let params = {
  Bucket: "game-launcher",
  Key: "latest.json",
  Body: latest_json,
};

s3.putObject(params, function (err, data) {
  if (err) {
    console.log(err);
  } else {
  }
});
