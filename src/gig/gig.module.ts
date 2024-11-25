import { Module } from '@nestjs/common';
import { GigService } from './gig.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gig, GigSchema } from './gig.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Gig.name, schema: GigSchema }])],
  providers: [GigService],
  exports: [GigService],
})
export class GigModule {}
