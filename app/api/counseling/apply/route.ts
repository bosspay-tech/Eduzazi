import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CounselingApplication, Product } from '@/lib/models';
import { getUserId } from '@/lib/server-utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    const {
      serviceId,
      fullName,
      email,
      phone,
      dob,
      gender,
      highestQualification,
      currentInstitution,
      passingYear,
      gpaOrPercentage,
      preferredCountry,
      preferredCourse,
      sopOrEssayText,
      additionalNotes,
    } = await request.json();

    // Required fields validation
    if (
      !serviceId ||
      !fullName ||
      !email ||
      !phone ||
      !dob ||
      !gender ||
      !highestQualification ||
      !currentInstitution ||
      !passingYear ||
      !gpaOrPercentage
    ) {
      return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
    }

    // Retrieve service details to get name & fee amount
    const service = await Product.findById(serviceId);
    if (!service) {
      return NextResponse.json({ error: 'Selected counseling service not found' }, { status: 404 });
    }

    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const application = await CounselingApplication.create({
      applicationId,
      userId,
      serviceId,
      serviceName: service.name,
      fullName,
      email,
      phone,
      dob: new Date(dob),
      gender,
      highestQualification,
      currentInstitution,
      passingYear: Number(passingYear),
      gpaOrPercentage,
      preferredCountry: preferredCountry || undefined,
      preferredCourse: preferredCourse || undefined,
      sopOrEssayText: sopOrEssayText || undefined,
      additionalNotes: additionalNotes || undefined,
      feeAmount: service.price, // fee amount is the service price
      paymentStatus: 'PENDING',
      applicationStatus: 'PENDING',
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Create counseling application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
