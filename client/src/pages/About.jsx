export default function About() {
  return (
    <div className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto bg-gradient-to-r from-gray-50 to-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-600 text-center lg:text-5xl">
        About AbodeConnect Estate
      </h1>
      <p className="mb-8 text-slate-700 leading-relaxed text-lg text-center">
        Welcome to <span className="font-semibold">AbodeConnect Estate</span>,a
        premier real estate agency dedicated to transforming your property
        journey into a seamless and rewarding experience, where dreams turn into
        addresses. With a passion for excellence and an unwavering commitment to
        service, we are here to guide you through every step of your real estate
        journey.
      </p>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Our Mission
        </h2>
        <p className="text-slate-700 leading-relaxed text-lg">
          At <span className="font-semibold">AbodeConnect Estate</span>, our
          mission is to empower individuals and families to find homes that
          match their aspirations. We believe that buying, selling, or renting a
          property should be an exciting and rewarding experience, and we are
          dedicated to making that a reality for all our clients. We strive to
          help individuals and families achieve their real estate dreams by
          offering unparalleled service and personalized solutions. Our deep
          understanding of the market and attention to detail ensure that every
          client’s unique needs are met with precision.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Why Choose AbodeConnect Estate?
        </h2>
        <ul className="list-disc pl-6 text-slate-700 leading-relaxed text-lg space-y-3">
          <li>
            <strong>Unparalleled Expertise:</strong> Our experienced agents
            bring deep market insights to help you make informed decisions.
          </li>
          <li>
            <strong>Expert Guidance:</strong> Our team of experienced
            professionals provides insights and advice tailored to your goals.
          </li>
          <li>
            <strong>Comprehensive Services:</strong> From property listings and
            marketing to seamless transactions, we handle everything end-to-end.
          </li>
          <li>
            <strong>Personalized Approach:</strong> We understand that every
            client is unique, and our services are tailored to meet your
            specific needs.
          </li>
          <li>
            <strong>Innovative Technology:</strong> Explore properties through
            cutting-edge virtual tours, 3D walkthroughs, and AI-powered
            recommendations.
          </li>
          <li>
            <strong>Client-Centric Values:</strong> Transparency, integrity, and
            trust are the cornerstones of our relationships.
          </li>
          <li>
            <strong>Extensive Market Knowledge:</strong> Our expertise spans a
            wide range of property types in the most sought-after neighborhoods.
          </li>
        </ul>
      </section>

      {/* Vision Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Our Vision
        </h2>
        <p className="text-slate-700 leading-relaxed text-lg">
          Our vision is to redefine real estate by combining technology,
          innovation, and exceptional service to create a seamless experience
          for every client. We aspire to be the first choice for anyone looking
          to buy, sell, or rent a property.
        </p>
      </section>

      {/* Contact CTA */}
      <div className="bg-slate-600 text-white py-8 px-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center">
          Ready to Take the Next Step?
        </h3>
        <p className="text-center text-lg mb-6">
          Whether you&apos;re searching for your dream home or looking to sell
          your property, <strong> AbodeConnect Estate</strong> is here to help.
          Contact us today and let’s make your real estate journey seamless and
          successful.
        </p>
        <div className="flex justify-center">
          <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
