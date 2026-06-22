import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { sendPasswordResetEmail } from '@/lib/email';

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
        message: 'If an account exists with that email, a password reset code has been sent.',
        success: true,
      });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    console.log(`[Forgot Password] Generated OTP code: ${resetToken} for user: ${user.email}`);
    console.log(`[Forgot Password] User fields in DB after save: token=${user.resetPasswordToken}, expires=${user.resetPasswordExpires}`);

    try {
      await sendPasswordResetEmail(email, user.name || 'there', resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return NextResponse.json({ error: 'Could not send password reset email. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'A password reset code has been sent to your email.',
      success: true,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
