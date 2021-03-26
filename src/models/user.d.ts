import mongoose from 'mongoose';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends mongoose.PassportLocalModel<mongoose.PassportLocalDocument> { }
  }
}
