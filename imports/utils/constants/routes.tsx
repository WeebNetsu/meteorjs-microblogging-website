import React from 'react';
import BrowsePage from '../../ui/BrowsePage';
import LoginPage from '/imports/ui/LoginPage';
import NotFoundPage from '/imports/ui/NotFoundPage';

/**
 * User does not have to be logged in to view these routes
 */
export const publicRoutes = {
    login: {
        path: '/login',
        element: (<LoginPage />) as React.ReactElement,
    },
    signup: {
        path: '/signup',
        element: (<LoginPage />) as React.ReactElement,
    },
    home: {
        // non-logged in users can view posts
        path: '/',
        element: (<BrowsePage />) as React.ReactElement,
    },
    default: {
        path: '*',
        element: (<LoginPage />) as React.ReactElement,
    },
};

/**
 * User has to be logged in to view these routes
 */
export const protectedRoutes = {
    // NOTE: Route order matters, root routes should be below their children
    home: {
        path: '/',
        element: (<BrowsePage />) as React.ReactElement,
    },
    default: {
        path: '*',
        element: (<NotFoundPage />) as React.ReactElement,
    },
};
