import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const accounts = getCollectionFn('accounts');
export const organizations = getCollectionFn('organizations');
export const knownTags = getCollectionFn('knownTags');
