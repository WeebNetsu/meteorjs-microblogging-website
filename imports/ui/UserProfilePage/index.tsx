import { LoadingOutlined } from '@ant-design/icons';
import { message, Space, Typography } from 'antd';
import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { BasicSiteProps } from '../App';
import NotFoundPage from '../NotFoundPage';
import UserProfileModel, { MethodSetUserProfileUpdateModel } from '/imports/api/userProfile/models';
import { AvailableCollectionNames, MethodUtilMethodsFindCollectionModel } from '/imports/api/utils/models';
import { isModerator } from '/imports/utils/checks';
import { publicRoutes } from '/imports/utils/constants/routes';
import { errorResponse } from '/imports/utils/errors';

// mention it is good planning to not fetch sensitive data such as first name and last name unless
// the user is allowed to see them
interface MiniUserProfilePageUserProfileModel
    extends Pick<UserProfileModel, '_id' | 'userId' | 'firstName' | 'lastName'> {}

const miniUserProfilePageUserProfileFields = {
    _id: 1,
    userId: 1,
    firstName: 1,
    lastName: 1,
};

interface UserProfilePageProps extends BasicSiteProps {}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, userRoles }) => {
    const { username } = useParams();
    const [location, navigate] = useLocation();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<MiniUserProfilePageUserProfileModel | undefined>();

    const fetchUserProfile = async () => {
        if (!username) return;

        try {
            const findData: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.USER_PROFILE,
                selector: {
                    username,
                },
                options: {
                    fields: miniUserProfilePageUserProfileFields,
                },
                onlyOne: true,
            };

            const res: MiniUserProfilePageUserProfileModel | undefined = await Meteor.callAsync(
                'utilMethods.findCollection',
                findData,
            );

            setUser(res);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }

        return undefined;
    };

    const fetchData = async (silent?: boolean) => {
        setLoading(!silent);

        await fetchUserProfile();

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingOutlined />;
    if (!user) return <NotFoundPage message={`User ${username} was not found`} />;

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
            await Meteor.callAsync('set.userProfile.update', data);
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
