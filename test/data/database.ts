import { MongoClient } from 'mongodb';
import { insertDiaryEntries } from './diary-entries';
import { insertImages } from './images';
import { insertSearchTags } from './search-tags';

export async function setupDB(url: string): Promise<TeardownDB> {
  const connection = await MongoClient.connect(url);

  const database = connection.db();
  await insertDiaryEntries(database);
  await insertSearchTags(database);
  await insertImages(database);

  return async () => await teardownDB(connection);
}

async function teardownDB(connection: MongoClient): Promise<void> {
  await connection.db().dropDatabase();
  await connection.close();
}

export type TeardownDB = () => ReturnType<typeof teardownDB>;
