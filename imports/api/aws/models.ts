// ---- METHODS
export enum AvailableAwsMethods {
    // GET
    GET_FILE_FROM_S3 = 'get.aws.fileFromS3',

    // SET
    SET_UPLOAD_FILE = 'set.aws.uploadFile',
    SET_DELETE_FILE = 'set.aws.deleteFile',
}

// ---- SET METHODS ----
export interface MethodSetAwsUploadFileModel {
    key: string;
    /**
     * Should be base64 for image
     */
    buffer: string;
    contentType: string;
}

export interface MethodSetAwsDeleteFileModel {
    key: string;
}

export interface MethodSetAwsDeleteMultipleFilesModel {
    keys: string[];
}

export interface MethodGetAWSFileFromS3Model {
    key: string;
}
