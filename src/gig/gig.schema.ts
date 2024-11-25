import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Gig {
  @Prop({ default: 'Unknown Gig' })
  title: string;

  @Prop()
  date: number;

  @Prop()
  location: string;

  @Prop()
  ticketsUrl: string;
}

export type GigDocument = HydratedDocument<Gig>;
export const GigSchema = SchemaFactory.createForClass(Gig);
