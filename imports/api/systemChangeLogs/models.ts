/**
 * System-wide logs of any updates running
 */
interface SystemChangeLogsModel {
    _id: string;
    userId: string;
    /**
     * Basic rundown of what changed
     */
    subject: string;
    note?: string;
    /**
     * The update applied to the database
     */
    update: string;
    /**
     * If an item in DB was updated, we may want to provide a prior state
     */
    previousState?: any;
    createdAt: Date;
}

export default SystemChangeLogsModel;

export enum AvailableSystemLogsSearchOptions {
    SUBJECT = 'subject',
    NOTE = 'note',
    UPDATE = 'update',
    ALL = 'all',
}

// ---- METHODS ----
export enum AvailableSystemChangeLogMethods {
    // GET
    GET_SEARCH = 'get.systemChangeLogs.search',

    // SET
    SET_CREATE = 'set.systemChangeLogs.create',
}

// ---- GET METHOD MODELS ----
export interface MethodGetSystemChangeLogsSearchModel {
    search: string;
    filter: AvailableSystemLogsSearchOptions;
    /**
     * If true then the search will strictly be against what the user typed
     */
    strict?: boolean;
    limit: number;
    skip: number;
}

export interface ResultGetSystemChangeLogsSearchModel {
    logs: SystemChangeLogsModel[];
    total: number;
}

// ---- SET METHOD MODELS ----
export interface MethodSetSystemChangeLogsCreateModel
    extends Omit<SystemChangeLogsModel, '_id' | 'createdAt' | 'userId'> {}
