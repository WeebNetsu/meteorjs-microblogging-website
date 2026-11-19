export interface PhotoModel {
    key: string;
    // you can save other information here like file type and size
}

interface UserProfileModel {
    _id: string;
    /**
     * User this profile is linked to
     */
    userId: string;
    /**
     * The first name of the user
     */
    firstName: string;
    /**
     * The last name of the user
     */
    lastName?: string;
    /**
     * There is a username field on the user model itself, but this feels more useful since we'll almost always
     * access the user profile instead of user account
     */
    username: string;
    photo?: PhotoModel;
}

export default UserProfileModel;

// ---- METHODS -----
export enum AvailableUserProfileMethods {
    // GET
    GET_PUBLIC_DATA = 'get.userProfiles.publicData',

    // SET
    SET_UPDATE = 'set.userProfile.update',
    SET_UPDATE_PROFILE_PHOTO = 'set.userProfile.updateProfilePhoto',
}

// ---- GET METHOD MODELS ----

export interface MethodGetUserProfilesPublicDataModel {
    /**
     * Will fetch data for the specific user, if not provided, will fetch data for current user
     */
    username?: string;
}

export interface ResultGetUserProfilesPublicDataResponseModel {
    user: Pick<UserProfileModel, '_id' | 'username' | 'photo' | 'firstName' | 'lastName' | 'userId'>;
}

// ---- SET METHOD MODELS ----
export interface MethodSetUserProfileUpdateModel {
    update: Partial<UserProfileModel>;
    userId: string;
}

export interface MethodSetUserProfileUpdateProfilePhotoModel {
    key: string;
    userId: string;
}
