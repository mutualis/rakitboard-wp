import { Link } from "react-router-dom";
import { Button } from "./ui";
import CommandSearch from "./CommandSearch.tsx";
import CategorySelector from "./CategorySelector.tsx";

interface HeroProps {
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
}

function Hero({ selectedCategory, onCategoryChange }: HeroProps) {
  return (
    <section className="relative text-center py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white rounded-3xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse delay-2000"></div>

      <div className="relative z-10">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            🚀 Tutorial Elektronik Terlengkap
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
          RakitBoard
          <br />
          <span className="text-4xl md:text-5xl">Tutorials</span>
        </h1>

        <p className="text-xl md:text-2xl mb-10 text-blue-50 max-w-3xl mx-auto leading-relaxed">
          Pelajari ESP32, ESP8266, Arduino, dan Raspberry Pi dengan tutorial
          lengkap, step-by-step, dan mudah dipahami untuk semua level
        </p>

        {/* Category Selector */}
        <div className="mb-8">
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>

        {/* Command Search Component */}
        <div className="mb-10 max-w-2xl mx-auto">
          <CommandSearch />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            asChild
          >
            <Link to="/categories">🎯 Jelajahi Kategori</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            asChild
          >
            <Link to="/posts">📚 Lihat Semua Artikel</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">100+</div>
            <div className="text-blue-100 text-sm">Tutorial Lengkap</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4</div>
            <div className="text-blue-100 text-sm">Kategori Utama</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-100 text-sm">Akses Selalu</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
