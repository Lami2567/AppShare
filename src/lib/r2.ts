import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function getR2Client() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredEnv("R2_ACCESS_KEY"),
      secretAccessKey: requiredEnv("R2_SECRET_KEY")
    }
  });
}

export function getObjectUrl(key: string) {
  const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (publicBase) {
    return `${publicBase}/${key}`;
  }
  return `r2://${requiredEnv("R2_BUCKET_NAME")}/${key}`;
}

export async function uploadApkToR2(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const bucket = requiredEnv("R2_BUCKET_NAME");
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable"
    })
  );

  return getObjectUrl(input.key);
}

export async function uploadFileToR2(input: {
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
}) {
  const bucket = requiredEnv("R2_BUCKET_NAME");
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: input.cacheControl ?? "public, max-age=31536000, immutable"
    })
  );

  return getObjectUrl(input.key);
}

export async function getDownloadUrl(keyOrUrl: string) {
  if (!keyOrUrl.startsWith("r2://")) {
    return keyOrUrl;
  }

  const [, rest] = keyOrUrl.split("r2://");
  const firstSlash = rest.indexOf("/");
  const bucket = rest.slice(0, firstSlash);
  const key = rest.slice(firstSlash + 1);

  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 60 * 10 }
  );
}

export async function deleteFromR2(key?: string | null) {
  if (!key) {
    return;
  }
  await getR2Client().send(new DeleteObjectCommand({ Bucket: requiredEnv("R2_BUCKET_NAME"), Key: key }));
}
