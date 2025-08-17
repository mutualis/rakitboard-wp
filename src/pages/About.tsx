function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">About RakitBoard</h1>
        
        <div className="prose prose-lg mx-auto text-left">
          <p className="text-xl text-gray-600 mb-8">
            RakitBoard adalah platform pembelajaran elektronika dan IoT yang menyediakan tutorial lengkap 
            untuk ESP32, ESP8266, Arduino, dan Raspberry Pi.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Misi Kami</h2>
          <p className="text-gray-600 mb-6">
            Kami berkomitmen untuk menyediakan tutorial berkualitas tinggi yang mudah dipahami oleh semua level, 
            dari pemula hingga advanced. Setiap tutorial dilengkapi dengan penjelasan detail, kode program, 
            dan diagram rangkaian yang jelas.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Yang Kami Tawarkan</h2>
          <ul className="text-gray-600 mb-6">
            <li>Tutorial step-by-step yang mudah diikuti</li>
            <li>Kode program lengkap dan teruji</li>
            <li>Diagram rangkaian dan skematik</li>
            <li>Tips dan trik dari pengalaman praktis</li>
            <li>Update konten secara berkala</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Kategori Tutorial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">ESP32 & ESP8266</h3>
              <p className="text-gray-600">Tutorial lengkap tentang mikrokontroler WiFi untuk proyek IoT</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Arduino</h3>
              <p className="text-gray-600">Panduan Arduino dari dasar hingga proyek advanced</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Raspberry Pi</h3>
              <p className="text-gray-600">Tutorial Raspberry Pi untuk berbagai aplikasi</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">MicroPython</h3>
              <p className="text-gray-600">Programming mikrokontroler dengan Python</p>
            </div>
          </div>
          
          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hubungi Kami</h3>
            <p className="text-gray-600">
              Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami di 
              <a href="mailto:info@rakitboard.com" className="text-blue-600 hover:text-blue-800">
                info@rakitboard.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;