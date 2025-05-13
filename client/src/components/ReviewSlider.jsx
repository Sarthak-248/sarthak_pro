import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';

const reviews = [
  {
    name: 'Gautam Adani',
    comment: 'An incredibly smooth experience. Highly satisfied with the platform!',
    photo: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Mukesh Ambani',
    comment: 'Easy to use and very reliable listings. Would definitely recommend.',
    photo: 'https://i.pravatar.cc/150?img=14',
  },
  {
    name: 'Damani',
    comment: 'Customer support was top-notch. Helped me through every step.',
    photo: 'https://i.pravatar.cc/150?img=15',
  },
  {
    name: 'C.K Birla',
    comment: 'Found my apartment faster than expected. Love the clean UI!',
    photo: 'https://i.pravatar.cc/150?img=20',
  },
];

export default function ReviewSlider() {
  return (
    <div className="relative w-full bg-blue-950 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 rounded-xl shadow-md">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 text-center mb-4">
          What People Say
        </h2>

        {/* Navigation Buttons */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <div className="swiper-button-prev cursor-pointer text-yellow-400 hover:text-yellow-200 text-xl bg-gray-800 p-2 sm:p-3 rounded-full shadow-lg mx-2">
            <FaArrowLeft />
          </div>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <div className="swiper-button-next cursor-pointer text-yellow-400 hover:text-yellow-200 text-xl bg-gray-800 p-2 sm:p-3 rounded-full shadow-lg mx-2">
            <FaArrowRight />
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="pb-4"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-900 bg-opacity-90 p-4 sm:p-5 rounded-lg shadow-md text-white text-center flex flex-col items-center mx-2 sm:mx-4 min-h-[180px]">
                <img
                  src={review.photo}
                  alt={review.name}
                  className="w-14 h-14 rounded-full mb-2 border-2 border-yellow-400 object-cover"
                />
                <p className="text-xs sm:text-sm italic mb-2 px-2">“{review.comment}”</p>
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="h-3 w-3 sm:h-4 sm:w-4" />
                  ))}
                </div>
                <h3 className="font-semibold text-yellow-300 text-xs sm:text-sm">
                  - {review.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
