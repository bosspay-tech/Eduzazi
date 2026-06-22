import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isVerified) {
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();

      try {
        await sendVerificationEmail(user.email, user.name, verificationToken);
        return NextResponse.json(
          {
            error: 'Your email is not verified. A new verification code has been sent to your email.',
            code: 'EMAIL_NOT_VERIFIED',
            verificationEmailSent: true,
          },
          { status: 403 }
        );
      } catch (emailError) {
        console.error('Failed to send verification email on login:', emailError);
        return NextResponse.json(
          {
            error: 'Your email is not verified. Could not send verification email. Please try again later.',
            code: 'EMAIL_NOT_VERIFIED',
            verificationEmailSent: false,
          },
          { status: 403 }
        );
      }
    }

    const sessionId = crypto.randomUUID();
    user.activeSessionId = sessionId;
    await user.save();

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      sessionId,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
