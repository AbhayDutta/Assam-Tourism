"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatBot } from "@/components/ChatBot";

interface Guide {
  id: string;
  name: string;
  email: string;
  phone: string;
  languages: string[];
  districts: string[];
  specialties: string[];
  experience: string;
  price_per_day: number;
  rating: number;
  reviews: number;
  verified: boolean;
  available: boolean;
  description: string;
  profile_image?: string;
}

const districts = [
  { slug: "guwahati", name: "Guwahati" },
  { slug: "kaziranga", name: "Kaziranga" },
  { slug: "majuli", name: "Majuli" },
  { slug: "shillong", name: "Shillong" },
  { slug: "tawang", name: "Tawang" },
  { slug: "manas", name: "Manas" },
  { slug: "sivasagar", name: "Sivasagar" },
  { slug: "tezpur", name: "Tezpur" }
];

const specialties = [
  "Wildlife Tours",
  "Cultural Heritage",
  "Tea Gardens",
  "Adventure Tours",
  "Temple Tours",
  "River Cruises",
  "Trekking",
  "Photography",
  "Handicrafts",
  "Bird Watching"
];

function GuideCard({ guide }: { guide: Guide }) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    tourist_name: "",
    tourist_email: "",
    tourist_phone: "",
    start_date: "",
    end_date: "",
    days: 1,
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    if (bookingForm.start_date && bookingForm.end_date) {
      const start = new Date(bookingForm.start_date);
      const end = new Date(bookingForm.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, days);
    }
    return 1;
  };

  const totalPrice = calculateDays() * guide.price_per_day;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guide_id: guide.id,
          ...bookingForm,
          days: calculateDays(),
          total_price: totalPrice
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Booking request submitted successfully! The guide will contact you soon.');
        setShowBookingModal(false);
        setBookingForm({
          tourist_name: "",
          tourist_email: "",
          tourist_phone: "",
          start_date: "",
          end_date: "",
          days: 1,
          message: ""
        });
      } else {
        alert(data.error || 'Failed to submit booking request');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error submitting booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--accent-warm)]/30 hover:shadow-lg">
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-warm)]/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--accent-warm)]">
              {guide.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{guide.name}</h3>
              {guide.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  ✓ Verified
                </span>
              )}
              {guide.available && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  Available
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1">
                ⭐ {guide.rating} ({guide.reviews} reviews)
              </span>
              <span>{guide.experience}</span>
              <span>₹{guide.price_per_day}/day</span>
            </div>
          </div>
        </div>

        <p className="text-[var(--muted)] mb-4">{guide.description}</p>

        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-[var(--foreground)]">Languages:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {guide.languages.map((lang) => (
                <span key={lang} className="px-2 py-1 text-xs bg-[var(--surface-elevated)] rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-[var(--foreground)]">Areas Covered:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {guide.districts.map((district) => (
                <span key={district} className="px-2 py-1 text-xs bg-[var(--surface-elevated)] rounded-full">
                  {district}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-[var(--foreground)]">Specialties:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {guide.specialties.map((specialty) => (
                <span key={specialty} className="px-2 py-1 text-xs bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] rounded-full">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex-1 bg-[var(--accent-warm)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-warm-hover)] transition-colors"
          >
            Book Guide
          </button>
          <button
            onClick={() => window.open(`tel:${guide.phone}`)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
          >
            📞 Call
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--surface)] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Book {guide.name}</h3>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.tourist_name}
                  onChange={(e) => setBookingForm({...bookingForm, tourist_name: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={bookingForm.tourist_email}
                  onChange={(e) => setBookingForm({...bookingForm, tourist_email: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.tourist_phone}
                  onChange={(e) => setBookingForm({...bookingForm, tourist_phone: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.start_date}
                    onChange={(e) => setBookingForm({...bookingForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.end_date}
                    onChange={(e) => setBookingForm({...bookingForm, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Message (Optional)</label>
                <textarea
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                  rows={3}
                  placeholder="Any special requirements or questions..."
                />
              </div>

              <div className="bg-[var(--surface-elevated)] p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--muted)]">Days: {calculateDays()}</span>
                  <span className="text-lg font-bold text-[var(--accent-warm)]">Total: ₹{totalPrice}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[var(--accent-warm)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-warm-hover)] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Book Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const { t } = useLanguage();

  const fetchGuides = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDistrict) params.append('district', selectedDistrict);
      if (selectedSpecialty) params.append('specialty', selectedSpecialty);
      if (showAvailableOnly) params.append('available', 'true');

      const response = await fetch(`/api/guides?${params}`);
      const data = await response.json();

      if (data.success) {
        setGuides(data.guides);
      }
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [selectedDistrict, selectedSpecialty, showAvailableOnly]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--background)]/95 to-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-warm)] flex items-center justify-center">
                <span className="text-white font-bold text-xl">🧭</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Travel Guides</h1>
                <p className="text-sm text-[var(--muted)]">Find experienced local guides for your Assam journey</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Filter by District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                >
                  <option value="">All Districts</option>
                  {districts.map((district) => (
                    <option key={district.slug} value={district.slug}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Filter by Specialty</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--foreground)]"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Availability</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="rounded border-[var(--border)]"
                  />
                  <span className="text-sm text-[var(--foreground)]">Available only</span>
                </label>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedDistrict("");
                    setSelectedSpecialty("");
                    setShowAvailableOnly(false);
                  }}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-[var(--muted)]">
            {loading ? 'Loading guides...' : `Found ${guides.length} guides`}
          </p>
        </div>

        {/* Guides Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse">
                <div className="h-4 bg-[var(--surface-elevated)] rounded mb-4"></div>
                <div className="h-3 bg-[var(--surface-elevated)] rounded mb-2"></div>
                <div className="h-3 bg-[var(--surface-elevated)] rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : guides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No guides found</h3>
            <p className="text-[var(--muted)]">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
      </div>

      <ChatBot />
    </main>
  );
}
