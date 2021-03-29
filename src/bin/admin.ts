import mongoose from 'mongoose';
import yargs from 'yargs';

import Admin from '../app/models/admin';


/**
 * Connect to data base.
 *
 * @param uri
 *   MongoDB URI
 */
async function connect(uri: string): Promise<void> {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(uri, mongooseOptions);
    console.log(`Connected to ${uri}.`);
  } catch (err) {
    console.error('Cannot connect to database.');
    console.error(err);
    process.exit(1);
  }
}

/**
 * Save new admin user to data base.
 *
 * @param uri
 *   MongoDB URI
 * @param username
 *   Admin user's username
 * @param password
 *   Admin user's password
 */
async function createAdmin(uri: string, username: string, password: string): Promise<void> {
  const admin = new Admin({username: username});

  try {
    await connect(uri);
    await admin.setPassword(password);
    await admin.save();
    console.log(`Admin user ${username} has been saved.`);
    await mongoose.connection.close();
  } catch (err) {
    console.error(`Admin user ${username} could not been saved.`);
    console.error(err);
    process.exit(1);
  }
}

// command-line arguments
const args = yargs
    .usage('Usage: $0 [options]')
    .options({
      uri: {
        describe: 'MongoDB URI',
        default: 'mongodb://localhost:27017/weltenbummlerpaar',
      },
      username: {
        describe: 'Admin user\'s username',
        demandOption: true,
        type: 'string'
      },
      password: {
        describe: 'Admin user\'s password',
        demandOption: true,
        type: 'string'
      }
    })
    .argv;

createAdmin(args.uri, args.username, args.password)
