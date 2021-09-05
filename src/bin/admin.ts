import mongoose from 'mongoose'
import yargs from 'yargs'

import Admin from '../app/models/admin'

/**
 * Connect to data base.
 *
 * @param uri
 *   MongoDB URI
 */
async function connect (uri: string): Promise<void> {
  await mongoose.connect(uri)
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
async function createAdmin (uri: string, username: string, password: string): Promise<void> {
  const admin = new Admin({ username: username })

  await connect(uri)
  await admin.setPassword(password)
  await admin.save()

  await mongoose.connection.close()
}

// command-line arguments
const args = yargs
  .usage('Usage: $0 [options]')
  .options({
    uri: {
      describe: 'MongoDB URI',
      default: 'mongodb://localhost:27017/weltenbummlerpaar'
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
  .parseSync()

createAdmin(args.uri, args.username, args.password).then(
  _ => console.log(`Admin user ${args.username} has been saved.`),
  err => {
    console.error(`Admin user ${args.username} could not be saved.`)
    console.error(err)
    process.exit(1)
  })
