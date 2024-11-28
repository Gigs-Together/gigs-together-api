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

// TODO: add allowing only specific status transitions
@Injectable()
export class GigService {
  constructor(@InjectModel(Gig.name) private gigModel: Model<Gig>) {}

  async handleGigSubmit(data: SubmitGigDto): Promise<void> {
    const savedGig = await this.saveGig(data.gig);
    if (data.isAdmin) {
      await this.handleGigApprove(savedGig._id);
    }
  }

  private async saveGig(data: GigDto): Promise<GigDocument> {
    const mappedData = {
      title: data.title,
      date: new Date(data.date).getTime(),
      location: data.location,
      ticketsUrl: data.ticketsUrl,
    };
    const createdGig = new this.gigModel(mappedData);
    return createdGig.save();
  }

  async handleGigApprove(gigId: string | Types.ObjectId): Promise<void> {
    const updatedGig = await this.updateGigStatus(gigId, Status.approved);
    // TODO: publish
  }

  private async updateGigStatus(
    gigId: string | Types.ObjectId,
    status: Status,
  ): Promise<GigDocument> {
    if (!Types.ObjectId.isValid(gigId)) {
      throw new BadRequestException(`Invalid MongoDB ID: ${gigId}`);
    }
    const updatedGig = await this.gigModel.findByIdAndUpdate(
      gigId,
      { status },
      { new: true },
    );

    if (!updatedGig) {
      throw new NotFoundException(`Gig with ID ${gigId} not found`);
    }

    return updatedGig;
  }
}
