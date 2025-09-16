export default function AboutPage() {
  return (
    <main className="bg-white py-40">
      {/* Hero */}
      <section className="py-14 md:py-20">
        <div className="ah-container mx-auto text-center">
          <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
            About Us
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Serving Freshness, One Bite at a Time
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            We craft mouthwatering dishes with carefully sourced ingredients and a passion for hospitality.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="ah-container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              It started with a simple idea: bring people together around delightful, honest food. From day one, we
              focused on seasonal produce, bold flavors, and warm service. Today, our menu blends classics you love
              with new favorites you haven’t met yet — all made with care.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Whether you’re here for a quick lunch, family dinner, or a celebratory feast, we’re dedicated to making it
              memorable.
            </p>
          </div>
          <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden shadow-lg">
            {/* Local public image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.jpg" alt="Our kitchen" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12">
        <div className="ah-container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard title="Fresh Ingredients" desc="We use seasonal, quality produce for peak flavor." />
            <ValueCard title="Made with Care" desc="Crafted by a team that loves great food and service." />
            <ValueCard title="Community First" desc="A welcoming space for friends, family, and neighbors." />
            <ValueCard title="Consistent Quality" desc="Your favorites — prepared right, every time." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="ah-container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat number="10k+" label="Happy Customers" />
          <Stat number="250+" label="Menu Creations" />
          <Stat number="4.8★" label="Average Rating" />
          <Stat number="7 Days" label="Open Every Day" />
        </div>
      </section>
    </main>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="text-2xl md:text-3xl font-bold text-orange-600">{number}</div>
      <div className="text-gray-600 mt-1 text-sm">{label}</div>
    </div>
  );
}