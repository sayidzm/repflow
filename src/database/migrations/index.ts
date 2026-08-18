import { initialSchemaMigration } from './001_initialSchema';

export const migrations = [initialSchemaMigration] as const;
