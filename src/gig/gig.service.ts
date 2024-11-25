import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGigDto } from './dto/gig.dto';
import { Gig } from './gig.schema';

@Injectable()
export class GigService {
  constructor(@InjectModel(Gig.name) private gigModel: Model<Gig>) {}

  async saveGig(data: CreateGigDto): Promise<Gig> {
    const mappedData = {
      title: data.title,
      date: new Date(data.date).getTime(),
      location: data.location,
      ticketsUrl: data.tickets,
      // TODO: "approved"
    };
    const createdGig = new this.gigModel(mappedData);
    return createdGig.save();
  }
}
