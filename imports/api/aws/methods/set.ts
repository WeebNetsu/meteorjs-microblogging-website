import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { AvailableAwsMethods, MethodSetAwsDeleteFileModel, MethodSetAwsUploadFileModel } from '../models';
import { deleteFileFromS3, uploadFileToS3 } from '/server/utils/s3';

Meteor.methods({
    [AvailableAwsMethods.SET_UPLOAD_FILE]: async function ({ key, buffer, contentType }: MethodSetAwsUploadFileModel) {
        check(key, String);
        check(buffer, String);
        check(contentType, String);

        const res = await uploadFileToS3(key, buffer, contentType);
        return res;
    },
    [AvailableAwsMethods.SET_DELETE_FILE]: async function ({ key }: MethodSetAwsDeleteFileModel) {
        check(key, String);

        const res = await deleteFileFromS3(key);
        return res;
    },
});
