import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    // Security best practice: do not reveal that a user does not exist
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with that email, a verification link has been sent.',
      });
    }

    if (user.isVerified) {
      return NextResponse.json({
        message: 'This email is already verified. You can log in now.',
        alreadyVerified: true,
      });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    try {
      await sendVerificationEmail(email, user.name, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json({ error: 'Could not send verification email. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'A new verification link has been sent to your email.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
