export default function About() {
  return (
    <section className="text-white body-font pt-24 py-8">
      <div className="responsive-container">
        <h2 className="font-agency underline text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center md:text-left">
          About Us:
        </h2>

        <div className="space-y-6">
          <div className="flex flex-row items-center justify-between mb-8">
            <div className="w-full md:w-1/2 mb-4 md:mb-0 flex justify-center">
              <img 
                src="/images/ai/1.jpeg" 
                alt="Evolution Fitness History" 
                className="w-full max-w-40 md:max-w-44 rounded-xl overflow-hidden border-2 border-red-600 shadow-[0_0_20px_5px_rgba(255,0,0,0.7)]"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="font-agency text-sm sm:text-2xl md:text-4xl leading-relaxed">
                Evolution Fitness was founded on August 15th, 2016 by <strong className="text-yellow-300">Hithesh Amin</strong>, with dedicated training guidance provided by <strong className="text-yellow-300">Ravi Kulai</strong>. From its very beginning, the foundation of the gym was built on <span className="text-red-400">passion</span>, <span className="text-orange-400">discipline</span>, and a strong commitment to helping individuals achieve their fitness goals. The vision was not just to create a workout space, but to build a community where people could transform themselves both <span className="text-green-300">physically</span> and <span className="text-blue-300">mentally</span> under expert supervision.
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between mb-8">
            <div className="w-full md:w-1/2">
              <p className="font-agency text-sm sm:text-2xl md:text-4xl leading-relaxed">
                Over the years, Evolution Fitness has earned a strong reputation for preparing bodybuilders for competitive platforms. The gym has consistently produced athletes who have delivered outstanding results across <span className="text-blue-300">district</span>, <span className="text-purple-300">state</span>, <span className="text-pink-300">national</span>, and even <span className="text-orange-300">Asian-level</span> competitions. This consistent success reflects the <span className="text-green-300">quality of training</span>, <span className="text-yellow-300">dedication of the coaches</span>, and the <span className="text-red-400">relentless effort</span> of the members who strive for excellence.
              </p>
            </div>
            <div className="w-full md:w-1/2 mb-4 md:mb-0 flex justify-center">
              <img 
                src="/images/ai/2.jpeg" 
                alt="Evolution Fitness Success" 
                className="w-full max-w-40 md:max-w-44 rounded-xl overflow-hidden border-2 border-red-600 shadow-[0_0_20px_5px_rgba(255,0,0,0.7)]"
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-between mb-8">
            <div className="w-full md:w-1/2 mb-4 md:mb-0 flex justify-center">
              <img 
                src="/images/ai/3.jpeg" 
                alt="Evolution Fitness Community" 
                className="w-full max-w-40 md:max-w-44 rounded-xl overflow-hidden border-2 border-red-600 shadow-[0_0_20px_5px_rgba(255,0,0,0.7)]"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="font-agency text-sm sm:text-2xl md:text-4xl leading-relaxed">
                Beyond the competitive stage, Evolution Fitness has played a significant role in transforming the lives of countless individuals. It has helped people build <span className="text-green-300">strength</span>, improve their <span className="text-blue-300">health</span>, boost <span className="text-purple-300">confidence</span>, and develop a <span className="text-orange-400">disciplined lifestyle</span>. For many, it has become more than just a gym—it is a place where they discovered their <span className="text-red-400">true potential</span> and reshaped their mindset towards fitness and life.
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between mb-8">
            <div className="w-full md:w-1/2">
              <p className="font-agency text-sm sm:text-2xl md:text-4xl leading-relaxed">
                The journey of Evolution Fitness is a story of steady growth and determination. What started as a <strong className="text-yellow-300">single branch in Mukka</strong> gradually expanded into a <strong className="text-green-300">second branch in Padubidri</strong> after five years, marking an important milestone in its success. Continuing this momentum, the gym further extended its reach by opening a <strong className="text-blue-300">third branch in Hosabettu</strong> within the next two years. Each step of this expansion reflects the <span className="text-red-400">passion</span>, <span className="text-orange-400">consistency</span>, and the <span className="text-green-400">unwavering dedication</span> behind the brand.
              </p>
            </div>
            <div className="w-full md:w-1/2 mb-4 md:mb-0 flex justify-center">
              <img 
                src="/images/ai/4.jpeg" 
                alt="Evolution Fitness Growth" 
                className="w-full max-w-40 md:max-w-44 rounded-xl overflow-hidden border-2 border-red-600 shadow-[0_0_20px_5px_rgba(255,0,0,0.7)]"
              />
            </div>
          </div>

          <p className="font-agency text-sm sm:text-2xl md:text-4xl leading-relaxed">
            Today, Evolution Fitness stands strong as a unified family of <strong className="text-yellow-300">three branches</strong>, all driven by one shared vision—to <span className="text-red-400">inspire</span> and <span className="text-green-400">transform</span> lives through fitness. The sense of <span className="text-blue-300">belonging</span> and <span className="text-purple-300">community</span> within Evolution is what truly sets it apart. As they proudly say, once you become a part of the Evolution Family, you will always remain a part of it.
          </p>
        </div>
      </div>
    </section>
  );
}
