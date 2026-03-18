import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Booking {
  id: string;
  guide_id: string;
  tourist_name: string;
  tourist_email: string;
  tourist_phone: string;
  start_date: string;
  end_date: string;
  days: number;
  total_price: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(BOOKINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load bookings from file
function loadBookings(): Booking[] {
  ensureDataDir();
  
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
  
  return [];
}

// Save bookings to file
function saveBookings(bookings: Booking[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Error saving bookings:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      guide_id,
      tourist_name,
      tourist_email,
      tourist_phone,
      start_date,
      end_date,
      days,
      total_price,
      message
    } = await request.json();

    // Validate required fields
    if (!guide_id || !tourist_name || !tourist_email || !tourist_phone || !start_date || !end_date || !days || !total_price) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create new booking
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      guide_id,
      tourist_name,
      tourist_email,
      tourist_phone,
      start_date,
      end_date,
      days,
      total_price,
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save booking
    const bookings = loadBookings();
    bookings.push(booking);
    saveBookings(bookings);

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking request submitted successfully! The guide will contact you soon.'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guide_id = searchParams.get('guide_id');
    const tourist_email = searchParams.get('tourist_email');

    let bookings = loadBookings();

    // Filter by guide
    if (guide_id) {
      bookings = bookings.filter(b => b.guide_id === guide_id);
    }

    // Filter by tourist email
    if (tourist_email) {
      bookings = bookings.filter(b => b.tourist_email === tourist_email);
    }

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
