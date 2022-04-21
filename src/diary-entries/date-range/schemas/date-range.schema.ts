import { Prop } from '@nestjs/mongoose';

export class DateRange {
  @Prop({ required: true })
  dateMin: Date;

  @Prop({ required: true })
  dateMax: Date;
}
