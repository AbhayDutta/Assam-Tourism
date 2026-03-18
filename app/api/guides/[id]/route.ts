import { NextRequest, NextResponse } from 'next/server';
import { findGuideById } from '@/lib/guides';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Guide ID is required' },
        { status: 400 }
      );
    }

    const guide = findGuideById(id);

    if (!guide) {
      return NextResponse.json(
        { error: 'Guide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      guide
    });
  } catch (error) {
    console.error('Error fetching guide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guide' },
      { status: 500 }
    );
  }
}
