import 'dotenv/config';
import connectDB from '../lib/db';
import { Product } from '../lib/models';
import { FEE_TIER_SERVICES, toSeedProduct } from './fee-tier-services';

const REQUESTED_PRICES = [
  300, 429, 529, 539, 759, 1079, 1299, 649, 779, 1069, 1289, 1299, 1399, 1409, 1999, 2159,
  2169, 2809, 3779, 4339,
];

async function main() {
  await connectDB();

  const existing = await Product.find({});
  const existingPrices = new Set(
    existing.map((product: { price: number | string }) => Number(product.price))
  );

  const skippedExisting = [...new Set(REQUESTED_PRICES)].filter((price) =>
    existingPrices.has(price)
  );

  const toInsert = FEE_TIER_SERVICES.filter(
    (service) => !existingPrices.has(service.price)
  ).map(toSeedProduct);

  if (toInsert.length === 0) {
    console.log('No new services to add — all fee tiers already exist.');
    if (skippedExisting.length) {
      console.log(`Skipped existing prices: ${skippedExisting.sort((a, b) => a - b).join(', ')}`);
    }
    process.exit(0);
  }

  const inserted = await Product.insertMany(toInsert);
  console.log(`Added ${inserted.length} new service(s):`);
  for (const product of inserted) {
    console.log(`  - ${product.name} (₹${product.price})`);
  }

  if (skippedExisting.length) {
    console.log(`Skipped existing prices: ${skippedExisting.sort((a, b) => a - b).join(', ')}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Failed to add fee-tier services:', error);
  process.exit(1);
});
