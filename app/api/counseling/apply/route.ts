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
      deliveryStreet,
      deliveryCity,
      deliveryState,
      deliveryPincode,
      billingSameAsDelivery,
      billingStreet,
      billingCity,
      billingState,
      billingPincode,
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

    const delivery = {
      street: String(deliveryStreet || '').trim(),
      city: String(deliveryCity || '').trim(),
      state: String(deliveryState || '').trim(),
      pincode: String(deliveryPincode || '').trim(),
    };

    if (!delivery.street || !delivery.city || !delivery.state || !delivery.pincode) {
      return NextResponse.json({ error: 'Delivery address is required' }, { status: 400 });
    }

    if (!/^\d{6}$/.test(delivery.pincode)) {
      return NextResponse.json({ error: 'Delivery pincode must be 6 digits' }, { status: 400 });
    }

    const sameAsDelivery = billingSameAsDelivery !== false;

    const billing = sameAsDelivery
      ? delivery
      : {
          street: String(billingStreet || '').trim(),
          city: String(billingCity || '').trim(),
          state: String(billingState || '').trim(),
          pincode: String(billingPincode || '').trim(),
        };

    if (!sameAsDelivery) {
      if (!billing.street || !billing.city || !billing.state || !billing.pincode) {
        return NextResponse.json({ error: 'Billing address is required when not same as delivery' }, { status: 400 });
      }
      if (!/^\d{6}$/.test(billing.pincode)) {
        return NextResponse.json({ error: 'Billing pincode must be 6 digits' }, { status: 400 });
      }
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
      deliveryStreet: delivery.street,
      deliveryCity: delivery.city,
      deliveryState: delivery.state,
      deliveryPincode: delivery.pincode,
      billingSameAsDelivery: sameAsDelivery,
      billingStreet: billing.street,
      billingCity: billing.city,
      billingState: billing.state,
      billingPincode: billing.pincode,
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
