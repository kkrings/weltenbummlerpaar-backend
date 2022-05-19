import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export async function teardownDB(app: INestApplication): Promise<void> {
  const connection: Connection = app.get(getConnectionToken());
  await connection.db.collection('diaryentries').deleteMany({});
  await connection.db.collection('searchtags').deleteMany({});
}
