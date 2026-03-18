import { NextRequest, NextResponse } from 'next/server';
import { getGuides, findGuidesByDistrict, findGuidesBySpecialty } from '@/lib/guides';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const specialty = searchParams.get('specialty');
    const available = searchParams.get('available');

    let guides = getGuides();

    // Filter by district
    if (district) {
      guides = guides.filter(guide => 
        guide.districts.some(d => d.toLowerCase().includes(district.toLowerCase()))
      );
    }

    // Filter by specialty
    if (specialty) {
      guides = guides.filter(guide => 
        guide.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    // Filter by availability
    if (available === 'true') {
      guides = guides.filter(guide => guide.available);
    }

    return NextResponse.json({
      success: true,
      guides,
      count: guides.length
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guides' },
      { status: 500 }
    );
  }
}
