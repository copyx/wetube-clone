import aws from "aws-sdk";

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
export const s3 = new aws.S3();

export const deleteS3Object = (location) => {
  const s3ObjectKey = location.split(".amazonaws.com/")[1];
  s3.deleteObject(
    {
      Bucket: BUCKET_NAME,
      Key: s3ObjectKey,
    },
    (error, data) => {
      if (error) {
        throw Error(error);
      } else {
        console.log(data);
      }
    }
  );
};
