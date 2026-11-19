import { LoadingOutlined } from '@ant-design/icons';
import { ConfigProvider, theme } from 'antd';
import React from 'react';
import { Route, Switch } from 'wouter';
import { AvailableUserRoles } from '../api/roles/models';
import { adminRoutes, protectedRoutes, publicRoutes } from '../utils/constants/routes';
import RouteRenderer from './components/RouteRenderer';
import { useUserContext } from './components/SiteContextProvider';

const App: React.FC = () => {
    const { userId, userRoles } = useUserContext();

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
                            <RouteRenderer>{route.element}</RouteRenderer>
                        </Route>
                    ))}

                {Object.values(protectedRoutes).map((route: any) => (
                    <Route key={route.path} path={route.path}>
                        <RouteRenderer>{route.element}</RouteRenderer>
                    </Route>
                ))}

                {/* since public routes contains the home routes, they need to be placed last */}
                {Object.values(publicRoutes).map((route) => (
                    <Route key={route.path} path={route.path}>
                        <RouteRenderer>{route.element}</RouteRenderer>
                    </Route>
                ))}
            </Switch>
        </ConfigProvider>
    );
};

export default App;
