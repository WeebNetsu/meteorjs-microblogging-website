import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Meteor } from 'meteor/meteor';

const s3 = new S3Client({
    region: Meteor.settings.S3Region as string,
    endpoint: Meteor.settings.S3Endpoint as string,
    credentials: {
        accessKeyId: Meteor.settings.S3AccessKeyId as string,
        secretAccessKey: Meteor.settings.S3SecretAccessKey as string,
    },
});

/**
 * Uploads an image to S3
 *
 * @param key - unique key for image in S3
 * @param buffer - base64 encoded image
 *
 * @NOTE SERVER ONLY
 */
export const uploadFileToS3 = async (key: string, buffer: string, contentType: string) => {
    const base64String = buffer.split(',').at(1); // Extract the base64-encoded portion

    if (!base64String) {
        throw new Meteor.Error(
            500,
            'Could not upload file to s3',
            'Splitting buffer failed with no value returned at index',
        );
    }

    const res = Buffer.from(base64String, 'base64');

    const params = {
        Bucket: Meteor.settings.S3Bucket as string,
        Key: key,
        Body: res,
        ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    const response = await s3.send(command);

    return response;
};

/**
 * Deletes a file from S3
 *
 * @param key - unique key for file in S3
 *
 * @NOTE SERVER ONLY
 */
export const deleteFileFromS3 = async (key: string) => {
    const params = {
        Bucket: Meteor.settings.S3Bucket as string,
        Key: key,
    };

    const command = new DeleteObjectCommand(params);
    const response = await s3.send(command);

    return response;
};

/**
 * Downloads an image from S3
 *
 * @param key - unique key for image in S3
 * @returns - S3 image object
 *
 * @NOTE SERVER ONLY
 */
export const downloadFileFromS3 = async (key: string) => {
    const params = {
        Bucket: Meteor.settings.S3Bucket as string,
        Key: key,
    };

    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, {});
    return signedUrl;
};
