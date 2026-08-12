const { exec } = require("child_process");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function backup() {
  const date = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const filename = `iutgate-backup-${date}.sql`;
  const filepath = path.join("/tmp", filename);

  console.log(`📦 Démarrage backup : ${filename}`);

  // 1. Dump PostgreSQL
  const pgDump = `pg_dump "${process.env.DATABASE_URL}" -f ${filepath} --no-password`;

  await new Promise((resolve, reject) => {
    exec(pgDump, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ pg_dump erreur:", stderr);
        reject(err);
      } else {
        console.log("✅ Dump SQL créé");
        resolve();
      }
    });
  });

  // 2. Upload vers S3
  const fileContent = fs.readFileSync(filepath);

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `backups/${filename}`,
      Body: fileContent,
      ContentType: "application/sql",
    }),
  );

  // 3. Nettoyage fichier local
  fs.unlinkSync(filepath);

  console.log(
    `✅ Backup uploadé sur S3 : s3://${process.env.AWS_S3_BUCKET}/backups/${filename}`,
  );
  console.log(`📅 Date : ${date}`);
}

backup().catch((err) => {
  console.error("❌ Backup échoué:", err.message);
  process.exit(1);
});
