import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

// Ensure directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'prescriptions');
fs.mkdirSync(uploadDir, { recursive: true });

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const productId = formData.get('productId') as string;

  if (!file || !productId) {
    return NextResponse.json({ error: 'Missing file or productId' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${productId}_${Date.now()}_${file.name}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  const url = `/uploads/prescriptions/${filename}`;

  return NextResponse.json({ success: true, url });
}
