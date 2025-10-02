import mongoose from 'mongoose';

const sessionShema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    accessToken: {
      type: String,
      required: [true, 'Access token is required'],
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
    },
    accessTokenValidUntil: {
      type: Date,
      required: [true, 'Access token expiration date is required'],
    },
    refreshTokenValidUntil: {
      type: Date,
      required: [true, 'Refresh token expiration date is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Session = mongoose.model('Session', sessionShema);
