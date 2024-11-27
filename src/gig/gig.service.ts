import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GigDto, SubmitGigDto } from './dto/gig.dto';
import { Gig, GigDocument } from '../schemas/gig.schema';
import { Status } from './enums/status.enum';

@Injectable()
export class GigService {
  constructor(@InjectModel(Gig.name) private gigModel: Model<Gig>) {}

  async handleGigSubmit(data: SubmitGigDto): Promise<void> {
    const mappedData = {
      title: data.title,
      date: new Date(data.date).getTime(),
      location: data.location,
      ticketsUrl: data.ticketsUrl,
    };
    const savedGig = await this.saveGig(mappedData);
    if (data.user.isAdmin) {
      await this.approveGig(savedGig._id);
    }
  }

  private async saveGig(data: GigDto): Promise<GigDocument> {
    const createdGig = new this.gigModel(data);
    return createdGig.save();
  }

  async approveGig(gigId: string | Types.ObjectId): Promise<void> {
    if (!Types.ObjectId.isValid(gigId)) {
      throw new BadRequestException(`Invalid MongoDB ID: ${gigId}`);
    }
    const updatedGig = await this.gigModel.findByIdAndUpdate(
      gigId,
      { status: Status.approved },
      { new: true },
    );

    if (!updatedGig) {
      throw new NotFoundException(`Gig with ID ${gigId} not found`);
    }

    // TODO: send to publish queue
  }
}
