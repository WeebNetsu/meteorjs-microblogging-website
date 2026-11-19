import { Mongo } from 'meteor/mongo';
import SystemChangeLogModel from './models';

const SystemChangeLogsCollection = new Mongo.Collection<SystemChangeLogModel>('system_change_logs');

export default SystemChangeLogsCollection;
