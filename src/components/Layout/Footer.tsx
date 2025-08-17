function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RakitBoard</h3>
            <p className="text-gray-300">
              Tutorial lengkap tentang ESP32, ESP8266, Arduino, dan Raspberry Pi untuk semua level.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/category/esp32" className="hover:text-white">ESP32</a></li>
              <li><a href="/category/esp8266" className="hover:text-white">ESP8266</a></li>
              <li><a href="/category/arduino" className="hover:text-white">Arduino</a></li>
              <li><a href="/category/raspberry-pi" className="hover:text-white">Raspberry Pi</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">
              Email: info@rakitboard.com<br />
              Website: rakitboard.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 RakitBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;