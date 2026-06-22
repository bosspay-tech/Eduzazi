import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    // Password Complexity Validation
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one uppercase letter.' }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one number.' }, { status: 400 });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one special character.' }, { status: 400 });
    }

    await connectDB();

    console.log(`[Reset Password] Attempting verify with token/OTP: "${token}"`);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log(`[Reset Password] No active user found for token: "${token}"`);
      // Check if token matches a user but has expired
      const expiredUser = await User.findOne({ resetPasswordToken: token });
      if (expiredUser) {
        console.log(`[Reset Password] Token found but it expired at: ${expiredUser.resetPasswordExpires}`);
        return NextResponse.json({
          error: 'Password reset code has expired. Please request a new one.'
        }, { status: 400 });
      }
      
      // Print database status for token search general debug
      const anyUserWithToken = await User.findOne({ resetPasswordToken: { $exists: true } });
      console.log(`[Reset Password] Database debug: Any user has token: ${anyUserWithToken ? 'Yes' : 'No'}`);
      if (anyUserWithToken) {
        console.log(`[Reset Password] Database debug: Found user with token "${anyUserWithToken.resetPasswordToken}"`);
      }
      
      return NextResponse.json({
        error: 'Invalid or already used password reset code.'
      }, { status: 400 });
    }

    console.log(`[Reset Password] Found user: ${user.email}. Changing password.`);

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Auto-verify user if they successfully reset password
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
