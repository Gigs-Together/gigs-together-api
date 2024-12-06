import { Module } from '@nestjs/common';
import { GigService } from './gig.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gig, GigSchema } from '../schemas/gig.schema';
import { PublisherModule } from '../publisher/publisher.module';
import { GigController } from './gig.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gig.name, schema: GigSchema }]),
    PublisherModule,
  ],
  providers: [GigService],
  exports: [GigService],
  controllers: [GigController],
})
export class GigModule {}
