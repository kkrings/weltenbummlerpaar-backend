import { MongoClient } from 'mongodb';
import { insertDiaryEntries } from './diary-entries';
import { insertSearchTags } from './search-tags';

export async function setupDB(url: string): Promise<TeardownDB> {
  const connection = await MongoClient.connect(url);

  const datebase = connection.db();
  await insertDiaryEntries(datebase);
  await insertSearchTags(datebase);

  return async () => await teardownDB(connection);
}

async function teardownDB(connection: MongoClient): Promise<void> {
  await connection.db().dropDatabase();
  await connection.close();
}

export type TeardownDB = () => ReturnType<typeof teardownDB>;
