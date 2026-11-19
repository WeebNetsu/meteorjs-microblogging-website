import { LoadingOutlined } from '@ant-design/icons';
import { limitText, regexStringSearch } from '@netsu/js-utils';
import { Avatar, message, Space, Typography, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { BasicSiteProps } from '../App';
import NotFoundPage from '../NotFoundPage';
import {
    AvailableAwsMethods,
    MethodGetAWSFileFromS3Model,
    MethodSetAwsDeleteFileModel,
    MethodSetAwsUploadFileModel,
} from '/imports/api/aws/models';
import UserProfileModel, {
    AvailableUserProfileMethods,
    MethodGetUserProfilesPublicDataModel,
    MethodSetUserProfileUpdateModel,
    MethodSetUserProfileUpdateProfilePhotoModel,
    ResultGetUserProfilesPublicDataResponseModel,
} from '/imports/api/userProfile/models';
import { encodeImageFileAsURL } from '/imports/utils';
import { isModerator } from '/imports/utils/checks';
import { publicRoutes } from '/imports/utils/constants/routes';
import { errorResponse } from '/imports/utils/errors';

// mention it is good planning to not fetch sensitive data such as first name and last name unless
// the user is allowed to see them
interface MiniUserProfilePageUserProfileModel
    extends Pick<UserProfileModel, '_id' | 'userId' | 'firstName' | 'lastName' | 'photo'> {}

const miniUserProfilePageUserProfileFields = {
    _id: 1,
    userId: 1,
    firstName: 1,
    lastName: 1,
    photo: 1,
};

interface UserProfilePageProps extends BasicSiteProps {}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, userRoles }) => {
    const { username } = useParams();
    const [location, navigate] = useLocation();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<MiniUserProfilePageUserProfileModel | undefined>();
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>();

    const fetchProfilePhoto = async (key: string) => {
        try {
            const data: MethodGetAWSFileFromS3Model = {
                key: key,
            };

            const res: string | undefined = await Meteor.callAsync(AvailableAwsMethods.GET_FILE_FROM_S3, data);

            setProfilePhoto(res);
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get some images');
        }
    };

    const fetchUserProfile = async () => {
        if (!username) return;

        try {
            const data: MethodGetUserProfilesPublicDataModel = {
                username,
            };

            const res: ResultGetUserProfilesPublicDataResponseModel = await Meteor.callAsync(
                AvailableUserProfileMethods.GET_PUBLIC_DATA,
                data,
            );

            setUser(res.user);

            return res.user;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }

        return undefined;
    };

    const fetchData = async (silent?: boolean) => {
        setLoading(!silent);

        const user = await fetchUserProfile();

        // note not awaiting to lazy load
        if (user?.photo?.key) fetchProfilePhoto(user.photo.key);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingOutlined />;
    if (!user) return <NotFoundPage message={`User ${username} was not found`} />;

    const handleUploadSingleImage = async (image: Blob | string | RcFile, oldImageKey: string | undefined) => {
        if (!image) return;

        // make sure we're getting a file or blob and not a string
        if (typeof image !== 'object') {
            // @ts-ignore not sure what to pass in
            if (onError) onError();
            return;
        }

        const newFile = new File(
            [image],
            // I don't know how to handle if we get a blob,
            // let's just hope we never do
            (image as RcFile).name.replace(/\s/g, '_'),
            {
                type: image.type,
            },
        );

        // delete existing image
        if (oldImageKey) {
            const deleteData: MethodSetAwsDeleteFileModel = {
                key: oldImageKey,
            };

            try {
                await Meteor.callAsync(AvailableAwsMethods.SET_DELETE_FILE, deleteData);
            } catch (error) {
                // do not throw an error
                // todo maybe notify dev?
                console.error(error);
            }
        }

        const base64Image = await encodeImageFileAsURL(newFile);

        if (typeof base64Image !== 'string') {
            message.error('Issue encoding image');
            return;
        }

        const key = Random.id();

        const data: MethodSetAwsUploadFileModel = {
            buffer: base64Image,
            contentType: newFile.type,
            key,
        };

        try {
            await Meteor.callAsync(AvailableAwsMethods.SET_UPLOAD_FILE, data);
        } catch (error) {
            console.error(error);
            // if an upload fails, we need to try to delete all uploaded images
            const deleteData: MethodSetAwsDeleteFileModel = {
                key,
            };

            try {
                await Meteor.callAsync(AvailableAwsMethods.SET_DELETE_FILE, deleteData);
            } catch (error) {
                // do not throw an error

                console.error(error);
                // todo maybe notify dev?
            }

            message.error('Failed to upload some images');
            return;
        }

        return key;
    };

    enum AvailableUpdateUserInfoOptions {
        USERNAME = 'username',
        FIRST_NAME = 'firstName',
        LAST_NAME = 'lastName',
    }

    const handleUpdateUserInfo = async (option: AvailableUpdateUserInfoOptions, value: string) => {
        // todo mention how doing client side checks is a smart idea instead of just sending it to the server
        const data: MethodSetUserProfileUpdateModel = {
            userId: user.userId,
            update: {
                [`${option}`]: value,
            },
        };

        try {
            await Meteor.callAsync(AvailableUserProfileMethods.SET_UPDATE, data);
        } catch (error) {
            return errorResponse(error as Meteor.Error, 'Could not update profile');
        }

        message.success('Profile updated');

        if (option === AvailableUpdateUserInfoOptions.USERNAME) {
            let newUsername = value;
            if (newUsername[0] !== '@') newUsername = `@${newUsername}`;

            navigate(publicRoutes.userProfile.path.replace(':username', newUsername));
        } else {
            // alternatively you could do a silent fetch instead
            setUser((u) => (u ? { ...u, [`${option}`]: value } : undefined));
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={async ({ file, onError, onSuccess }) => {
                    const key = await handleUploadSingleImage(file, user.photo?.key);

                    if (key) {
                        try {
                            const data: MethodSetUserProfileUpdateProfilePhotoModel = {
                                key,
                                userId: user.userId,
                            };

                            await Meteor.callAsync(AvailableUserProfileMethods.SET_UPDATE_PROFILE_PHOTO, data);
                        } catch (error) {
                            // homework suggestion: delete the newly uploaded image if this happens
                            return errorResponse(error as Meteor.Error, 'Could not save new profile photo');
                        }

                        fetchProfilePhoto(key);
                    }
                    // handleAddImageToList(file, 'outside', onError, onSuccess);
                }}
                onDrop={(e) => {
                    Object.values(e.dataTransfer.files).forEach((file) => {
                        if (
                            !regexStringSearch('jpg', file.type) &&
                            !regexStringSearch('jpeg', file.type) &&
                            !regexStringSearch('png', file.type)
                        ) {
                            message.error(`${file.name} is not an image`);
                        }
                    });
                }}
            >
                {profilePhoto ? (
                    <Avatar
                        src={profilePhoto}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', maxWidth: 100, maxHeight: 100 }}
                        alt="avatar"
                    />
                ) : (
                    <Avatar style={{ backgroundColor: '#ff98ad', verticalAlign: 'middle' }} size={100} gap={4}>
                        {limitText(username ?? '', 7)}
                    </Avatar>
                )}
            </Upload>

            <Typography.Title
                level={2}
                editable={
                    userId === user.userId || isModerator(userRoles ?? [])
                        ? { onChange: (e) => handleUpdateUserInfo(AvailableUpdateUserInfoOptions.USERNAME, e) }
                        : false
                }
            >
                {username}
            </Typography.Title>

            {(userId === user.userId || isModerator(userRoles ?? [])) && (
                <Space>
                    <Typography.Text
                        editable={{
                            onChange: (e) => handleUpdateUserInfo(AvailableUpdateUserInfoOptions.FIRST_NAME, e),
                        }}
                    >
                        {user.firstName}
                    </Typography.Text>
                    <Typography.Text
                        editable={{
                            onChange: (e) => handleUpdateUserInfo(AvailableUpdateUserInfoOptions.LAST_NAME, e),
                        }}
                    >
                        {user.lastName}
                    </Typography.Text>
                </Space>
            )}
        </Space>
    );
};

export default UserProfilePage;
