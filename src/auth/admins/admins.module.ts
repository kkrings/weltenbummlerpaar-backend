import * as passportLocalMongoose from 'passport-local-mongoose';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsService } from './admins.service';
import { Admin, AdminSchema } from './schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Admin.name,
        useFactory: () => {
          const adminSchema = AdminSchema;
          adminSchema.plugin(passportLocalMongoose);
          return adminSchema;
        },
      },
    ]),
  ],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
