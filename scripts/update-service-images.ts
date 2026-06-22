import 'dotenv/config';
import connectDB from '../lib/db';
import { Product } from '../lib/models';
import { serviceImages, getServiceImage } from './service-images';

async function updateServiceImages() {
  try {
    await connectDB();
    console.log('Connected to database...');

    // Get all existing products
    const products = await Product.find({});
    console.log(`Found ${products.length} services in database`);

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const product of products) {
      const imageUrl = serviceImages[product.name] || getServiceImage(product.name);
      
      if (imageUrl) {
        await Product.updateOne(
          { _id: product._id },
          { $set: { image: imageUrl } }
        );
        console.log(`✅ Updated: ${product.name}`);
        updatedCount++;
      } else {
        console.log(`⚠️  No image found for: ${product.name}`);
        notFoundCount++;
      }
    }

    console.log('\n───────────────────────────────────────');
    console.log(`✅ Successfully updated ${updatedCount} services`);
    if (notFoundCount > 0) {
      console.log(`⚠️  ${notFoundCount} services had no image mapping`);
    }
    console.log('───────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating service images:', err);
    process.exit(1);
  }
}

updateServiceImages();
