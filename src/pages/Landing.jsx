import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { courses } from "../data";

/* ---------- DATA ---------- */

const HERO_BANNERS = [
  "https://img-c.udemycdn.com/notices/featured_carousel_slide/image/e0e0a4a0-6e92-4f5a-b80b-2df879a97bde.png",
  "https://img-c.udemycdn.com/notices/web_carousel_slide/image/6caba229-b963-4af8-84b8-f71693be2507.jpg",
];

const STATS = [
  { value: "30+", label: "Premium courses" },
  { value: "10k+", label: "Learners exploring topics" },
  { value: "4.7/5", label: "Average learner satisfaction" },
  { value: "100%", label: "Self-paced PDF delivery model" },
];

/* ---------- HELPERS ---------- */

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const clampText = (value = "", max = 140) => {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
};

const shuffle = (arr = []) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/* ---------- PAGE ---------- */

export default function Landing() {
  const featuredCourses = useMemo(() => {
    return shuffle(courses).slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative border-b border-gray-200 bg-white">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          navigation
          className="h-[420px] sm:h-[500px] md:h-[580px]"
        >
          {HERO_BANNERS.map((src, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-full">
                <img
                  src={src}
                  className="h-full w-full object-cover"
                  alt="Learning banner"
                />
                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                    <div className="max-w-xl rounded-xl bg-white p-6 shadow-xl sm:p-8">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5624d0]">
                        Learn smarter, grow faster
                      </p>

                      <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                        Learn new skills online with structured, practical
                        courses
                      </h2>

                      <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                        Discover high-quality courses designed to help
                        beginners, professionals, and career switchers build
                        real knowledge with easy-to-follow material, self-paced
                        access, and topic-focused learning paths.
                      </p>

                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        From AI and machine learning to cybersecurity, business,
                        analytics, and project management, explore content that
                        feels useful, complete, and worth spending time on.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          to="/products"
                          className="inline-flex items-center rounded-md bg-[#a435f0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8710d8]"
                        >
                          Browse courses
                        </Link>

                        <Link
                          to="/products"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                        >
                          View top picks
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* INTRO COPY */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5624d0]">
              Explore practical learning
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Build skills that actually feel useful
            </h2>

            <p className="mt-4 text-base leading-8 text-gray-600">
              This platform is designed to make learning feel structured,
              approachable, and valuable. Instead of thin listings and empty
              layouts, the experience focuses on clear presentation, course
              depth, strong first impressions, and enough supporting content to
              help learners feel confident before they buy.
            </p>

            <p className="mt-4 text-base leading-8 text-gray-600">
              Whether someone is exploring a new field, brushing up on concepts,
              or looking for career-focused upskilling material, the goal is to
              provide a course catalog that feels rich, modern, and trusted from
              the very first screen.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-gray-200 bg-[#f7f9fa]">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="text-2xl font-bold text-gray-900">
                {item.value}
              </div>
              <div className="mt-2 text-sm leading-6 text-gray-600">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-b border-gray-200 bg-[#f7f9fa]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8 max-w-3xl">
            <h3 className="text-2xl font-bold text-gray-900">
              Why learners choose this platform
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              The experience is built to feel clean, credible, and content-rich.
              Every section exists to make the page feel fuller, more useful,
              and more convincing for someone who is actively exploring a
              course.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <TrustItem
              title="Expert instructors"
              desc="Learn from people with practical knowledge, industry context, and structured teaching approaches."
            />
            <TrustItem
              title="Learn anytime"
              desc="Access course material on your schedule with self-paced delivery and flexible reading."
            />
            <TrustItem
              title="Secure payments"
              desc="Enjoy a straightforward and reliable purchase flow built for simple digital delivery."
            />
          </div>
        </div>
      </section>

      {/* TOP COURSES */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5624d0]">
                Top courses
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                Popular picks from our catalog
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Here are 3 randomly selected courses from the catalog to make
                the landing page feel active and content-led. These cards are
                pulled directly from your course array and can later be replaced
                with actual featured, trending, or best-selling logic.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center rounded-md border border-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              View all courses
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredCourses.map((course, index) => (
              <Link
                key={`${course.title}-${index}`}
                to={`/products/${slugify(course.title)}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#5624d0]">
                    Featured course
                  </div>

                  <h4 className="mt-2 line-clamp-2 text-lg font-bold leading-7 text-gray-900">
                    {course.title}
                  </h4>

                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                    {clampText(course.description, 180)}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">
                      ₹{course.price}
                    </div>
                    <span className="text-sm font-semibold text-[#5624d0]">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RICH CONTENT BLOCK */}
      <section className="border-b border-gray-200 bg-[#f7f9fa]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5624d0]">
              Learn with clarity
            </p>
            <h3 className="mt-3 text-2xl font-bold text-gray-900">
              Structured learning that does not feel overwhelming
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              A strong landing page should not feel empty. It should explain the
              value, create trust, highlight the course catalog, and make the
              user feel there is enough substance behind the offer. This section
              exists as supportive dummy content so the page immediately feels
              more complete and premium.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              You can later replace this text with brand messaging, student
              stories, feature breakdowns, or category-specific highlights. For
              now, it gives the page breathing room and makes the layout feel
              intentionally designed rather than unfinished.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5624d0]">
              Learn with confidence
            </p>
            <h3 className="mt-3 text-2xl font-bold text-gray-900">
              A more content-rich first impression
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              The more complete a landing page feels, the easier it becomes to
              trust the platform. Sections like benefits, featured courses,
              content blocks, trust indicators, and a stronger closing call to
              action help transform a basic page into something that feels ready
              to present.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              This is especially useful when the site is still under development
              and you want the frontend to look alive, realistic, and
              presentation-ready even before dynamic APIs and production content
              are fully finalized.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORY STYLE DUMMY GRID */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5624d0]">
              Learning categories
            </p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              Explore topics learners care about
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              This section is dummy but useful. It gives more visual weight to
              the page and helps visitors quickly understand the breadth of
              learning available across the platform.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CategoryCard
              title="Artificial Intelligence"
              desc="Courses covering generative AI, machine learning, practical workflows, and modern industry applications."
            />
            <CategoryCard
              title="Cybersecurity"
              desc="Learn digital defense, threat awareness, security operations, and practical protection strategies."
            />
            <CategoryCard
              title="Business & Leadership"
              desc="Develop strategic thinking, decision-making, operations understanding, and leadership confidence."
            />
            <CategoryCard
              title="Project Management"
              desc="Improve planning, delivery, execution tracking, and collaboration across real project environments."
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL STYLE DUMMY SECTION */}
      <section className="border-b border-gray-200 bg-[#f7f9fa]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5624d0]">
              Learner voices
            </p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900">
              A platform that feels worth exploring
            </h3>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <TestimonialCard
              text="The layout feels much more complete and easier to trust. It looks like a real learning platform instead of a placeholder page."
              name="Rohit"
              role="Early learner"
            />
            <TestimonialCard
              text="I like that the page now has real structure, strong sections, and visible course cards. It instantly feels more ready."
              name="Sneha"
              role="Working professional"
            />
            <TestimonialCard
              text="The extra content helps a lot. It gives the landing page depth and makes the site feel active before final content is added."
              name="Aman"
              role="Course explorer"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-[#f7f9fa] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-gray-900">
                Ready to start learning?
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                Explore the full course catalog, discover detailed learning
                pages, and find the right course for your next skill upgrade.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-md border border-gray-900 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Explore courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function TrustItem({ title, desc }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">{desc}</p>
    </div>
  );
}

function CategoryCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-gray-600">{desc}</p>
    </div>
  );
}

function TestimonialCard({ text, name, role }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-[#e59819]">★★★★★</div>
      <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
      <div className="mt-5">
        <div className="text-sm font-bold text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
  );
}
