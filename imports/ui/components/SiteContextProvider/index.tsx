import { LoadingOutlined } from '@ant-design/icons';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AvailableAwsMethods, MethodGetAWSFileFromS3Model } from '/imports/api/aws/models';
import {
    AvailableRolesMethods,
    AvailableUserRoles,
    MethodGetRolesUserRolesModel,
    ResultGetRolesUserRolesModel,
} from '/imports/api/roles/models';
import UserProfileModel, {
    AvailableUserProfileMethods,
    MethodGetUserProfilesPublicDataModel,
    ResultGetUserProfilesPublicDataResponseModel,
} from '/imports/api/userProfile/models';
import { errorResponse } from '/imports/utils/errors';

/**
 * Defines the type for a userId on login
 *
 * null - not logged in
 * undefined - loading data
 * string - logged in (user id)
 */
export type UserContextUserIdModel = string | undefined | null;

type UserContextUserProfileModel = Pick<UserProfileModel, '_id' | 'username' | 'photo' | 'firstName' | 'lastName'>;

interface UserContextType {
    userProfile: UserContextUserProfileModel | undefined;
    userRoles: AvailableUserRoles[];
    profilePhoto: string | undefined;
    userId: UserContextUserIdModel;
}

const UserContext = createContext<UserContextType>({
    userProfile: undefined,
    userRoles: [],
    profilePhoto: undefined,
    userId: undefined,
});

export const useUserContext = () => useContext(UserContext);

interface UserContextProviderProps {
    children: React.ReactNode;
}

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
    const userId: UserContextUserIdModel = useTracker(() => Meteor.userId());

    const [loading, setLoading] = useState(true);
    /**
     * Basic public profile data that is required by most pages
     */
    const [userProfile, setUserProfile] = useState<UserContextUserProfileModel | undefined>();
    const [userRoles, setUserRoles] = useState<AvailableUserRoles[]>([]);
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>();

    const fetchUserRole = async () => {
        if (!userId) return;

        try {
            const findData: MethodGetRolesUserRolesModel = {
                userIds: [userId],
            };

            const res: ResultGetRolesUserRolesModel = await Meteor.callAsync(
                AvailableRolesMethods.GET_USER_ROLES,
                findData,
            );

            setUserRoles(res.result.find((r) => r.userId === userId)?.roles ?? []);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get roles');
        }

        return undefined;
    };

    const fetchUserProfile = async () => {
        if (!userId) return;

        try {
            const data: MethodGetUserProfilesPublicDataModel = {};

            const res: ResultGetUserProfilesPublicDataResponseModel = await Meteor.callAsync(
                AvailableUserProfileMethods.GET_PUBLIC_DATA,
                data,
            );

            setUserProfile(res.user);

            return res.user;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }

        return undefined;
    };

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

    const fetchData = async (silent = false) => {
        setLoading(!silent);

        if (userId) {
            const profile = await fetchUserProfile();
            await fetchUserRole();
            // allow to lazy load
            if (profile?.photo?.key) fetchProfilePhoto(profile?.photo?.key);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        } else {
            setUserProfile(undefined);
            setLoading(false);
        }
    }, [userId]);

    const providerData = useMemo(
        () => ({
            userProfile,
            userRoles,
            profilePhoto,
            userId,
        }),
        [userId, userProfile, userRoles, profilePhoto],
    );

    return (
        <UserContext.Provider value={providerData}>
            {loading || userId === undefined ? <LoadingOutlined /> : children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
