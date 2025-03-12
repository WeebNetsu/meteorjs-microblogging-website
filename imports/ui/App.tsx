import { LoadingOutlined } from '@ant-design/icons';
import { ConfigProvider, theme } from 'antd';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import { AvailableUserRoles, MethodGetRolesUserRolesModel, ResultGetRolesUserRolesModel } from '../api/roles/models';
import UserProfileModel from '../api/userProfile/models';
import { AvailableCollectionNames, MethodUtilMethodsFindCollectionModel } from '../api/utils/models';
import { ComponentProps } from '../types/interfaces';
import { adminRoutes, protectedRoutes, publicRoutes } from '../utils/constants/routes';
import { errorResponse } from '../utils/errors';
import RouteRenderer from './components/RouteRenderer';

export interface MiniAppUserProfileModel extends Pick<UserProfileModel, '_id' | 'username'> {}

const miniAppUserProfileFields = {
    _id: 1,
    username: 1,
};

/**
 * Defines the type for a userId on login
 *
 * null - not logged in
 * undefined - loading data
 * string - logged in (user id)
 */
export type AppUserIdModel = string | undefined | null;

export interface BasicSiteProps extends ComponentProps {
    userId?: string;
    userProfile?: MiniAppUserProfileModel;
    userRoles?: AvailableUserRoles[];
}

const App: React.FC = () => {
    const userId: AppUserIdModel = useTracker(() => Meteor.userId());
    /**
     * Basic public profile data that is required by most pages (reduces fetch requests)
     */
    const [userProfile, setUserProfile] = useState<MiniAppUserProfileModel | undefined>();
    const [loading, setLoading] = useState(true);
    const [userRoles, setUserRoles] = useState<AvailableUserRoles[]>([]);

    const fetchUserRole = async () => {
        if (!userId) return;

        try {
            const findData: MethodGetRolesUserRolesModel = {
                userIds: [userId],
            };

            const res: ResultGetRolesUserRolesModel = await Meteor.callAsync('get.roles.userRoles', findData);

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
            const findData: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.USER_PROFILE,
                selector: {
                    userId,
                },
                options: {
                    fields: miniAppUserProfileFields,
                },
                onlyOne: true,
            };

            const res: MiniAppUserProfileModel | undefined = await Meteor.callAsync(
                'utilMethods.findCollection',
                findData,
            );

            setUserProfile(res);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }

        return undefined;
    };

    const fetchData = async (silent = false) => {
        setLoading(!silent);

        if (userId) {
            await fetchUserProfile();
            await fetchUserRole();
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

    // user is not logged in
    if (userId === null) {
        // you can add any config providers here to cover all public routes
        return (
            <ConfigProvider
                theme={{
                    // change to defaultAlgorithm for light theme
                    algorithm: theme.darkAlgorithm,
                }}
            >
                <Switch>
                    {Object.values(publicRoutes).map((route) => (
                        <Route key={route.path} path={route.path}>
                            <RouteRenderer>{route.element}</RouteRenderer>
                        </Route>
                    ))}
                </Switch>
            </ConfigProvider>
        );
    }

    // still loading data from backend
    if (userId === undefined) return <LoadingOutlined />;

    // you can add any config providers here to cover all protected routes
    return (
        <ConfigProvider
            theme={{
                // change to defaultAlgorithm for light theme
                algorithm: theme.darkAlgorithm,
            }}
        >
            <Switch>
                {userRoles.includes(AvailableUserRoles.ADMIN) &&
                    Object.values(adminRoutes).map((route) => (
                        <Route key={route.path} path={route.path}>
                            <RouteRenderer userId={userId} userProfile={userProfile} userRoles={userRoles}>
                                {React.cloneElement(route.element, { userId, userProfile, userRoles })}
                            </RouteRenderer>
                        </Route>
                    ))}

                {Object.values(protectedRoutes).map((route) => (
                    <Route key={route.path} path={route.path}>
                        <RouteRenderer userId={userId} userProfile={userProfile} userRoles={userRoles}>
                            {React.cloneElement(route.element, { userId, userProfile, userRoles })}
                        </RouteRenderer>
                    </Route>
                ))}
            </Switch>
        </ConfigProvider>
    );
};

export default App;
