import mongoose, { Document, Schema } from 'mongoose';

export interface IParticipant {
  _id?: mongoose.Types.ObjectId;
  displayName: string;
  joinedAt: Date;
}

export interface ISession extends Document {
  title: string;
  code: string;
  joinUrl?: string;
  teacher?: mongoose.Types.ObjectId;
  students?: mongoose.Types.ObjectId[];
  participants: IParticipant[];
  status: 'active' | 'inactive' | 'ended' | 'paused';
  startedAt?: Date;
  endedAt?: Date;
}

const participantSchema = new Schema<IParticipant>(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [80, 'Name is too long'],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const sessionSchema = new Schema<ISession>({
  title: {
    type: String,
    required: [true, 'Please provide a session title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  joinUrl: {
    type: String,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  participants: {
    type: [participantSchema],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'ended', 'paused'],
    default: 'active',
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
});

const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;
