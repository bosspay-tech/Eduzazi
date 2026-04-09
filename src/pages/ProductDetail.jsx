import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { STORE_ID } from "../config/store";
import { useCartStore } from "../store/cart.store";
import toast from "react-hot-toast";
import { courses } from "../data";

/* ---------- HELPERS ---------- */
const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const clampText = (value = "", max = 180) => {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
};

const inferCategory = (title = "", description = "") => {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("cybersecurity") ||
    text.includes("ethical hacking") ||
    text.includes("cloud security") ||
    text.includes("malware")
  ) {
    return "Cybersecurity";
  }

  if (
    text.includes("full stack") ||
    text.includes("mern") ||
    text.includes("developer")
  ) {
    return "Software Development";
  }

  if (
    text.includes("project management") ||
    text.includes("pmp") ||
    text.includes("agile")
  ) {
    return "Project Management";
  }

  if (
    text.includes("data science") ||
    text.includes("data analytics") ||
    text.includes("analytics")
  ) {
    return "Data Science & Analytics";
  }

  if (text.includes("ui/ux") || text.includes("design")) {
    return "Design";
  }

  if (
    text.includes("business") ||
    text.includes("leadership") ||
    text.includes("management") ||
    text.includes("finance") ||
    text.includes("strategy") ||
    text.includes("supply chain")
  ) {
    return "Business & Leadership";
  }

  if (
    text.includes("ai") ||
    text.includes("machine learning") ||
    text.includes("generative ai") ||
    text.includes("llm") ||
    text.includes("agentic")
  ) {
    return "Artificial Intelligence";
  }

  return "Professional Certification";
};

const inferLevel = (title = "", description = "") => {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("advanced") ||
    text.includes("executive") ||
    text.includes("cxo") ||
    text.includes("leadership")
  ) {
    return "Advanced";
  }

  if (
    text.includes("professional certificate") ||
    text.includes("specialization") ||
    text.includes("bootcamp") ||
    text.includes("master")
  ) {
    return "Intermediate";
  }

  return "Beginner to Intermediate";
};

const getInstructorName = (category) => {
  if (category === "Artificial Intelligence") return "Dr. Arjun Mehta";
  if (category === "Cybersecurity") return "Karan Khanna";
  if (category === "Software Development") return "Neha Bansal";
  if (category === "Data Science & Analytics") return "Ritika Sharma";
  if (category === "Project Management") return "Vivek Sinha";
  if (category === "Design") return "Ayesha Kapoor";
  return "Industry Expert Faculty";
};

const getSkillsByCategory = (category) => {
  const map = {
    "Artificial Intelligence": [
      "Prompt engineering",
      "Model evaluation",
      "Workflow design",
      "Responsible AI",
      "LLM applications",
      "Hands-on project thinking",
    ],
    Cybersecurity: [
      "Threat analysis",
      "Risk assessment",
      "Network defense",
      "Incident response",
      "Security fundamentals",
      "Practical monitoring",
    ],
    "Software Development": [
      "Frontend development",
      "Backend architecture",
      "API integration",
      "State management",
      "Deployment basics",
      "Project building",
    ],
    "Data Science & Analytics": [
      "Data analysis",
      "Visualization",
      "Model building",
      "Business insights",
      "Experimentation",
      "Tool proficiency",
    ],
    "Project Management": [
      "Scope planning",
      "Stakeholder management",
      "Agile workflows",
      "Execution tracking",
      "Risk control",
      "Delivery governance",
    ],
    Design: [
      "UI thinking",
      "UX research",
      "Design systems",
      "Wireframing",
      "Prototyping",
      "Visual hierarchy",
    ],
    "Business & Leadership": [
      "Strategic thinking",
      "Decision making",
      "AI readiness",
      "Operational planning",
      "Team leadership",
      "Business transformation",
    ],
  };

  return (
    map[category] || [
      "Structured learning",
      "Practical understanding",
      "Framework-based thinking",
      "Execution clarity",
      "Professional readiness",
      "Self-paced learning",
    ]
  );
};

const buildLearnItems = (course, category) => [
  `Build a strong understanding of ${category.toLowerCase()} concepts through structured lessons and guided reading.`,
  `Translate ${course.title} into practical real-world outcomes with examples, frameworks, and easy-to-follow explanations.`,
  "Gain job-relevant knowledge that can help in interviews, project execution, career growth, and portfolio confidence.",
  "Use the material for self-paced study, revision, reference, and continued upskilling after the first read.",
  "Understand key terminology, workflows, and decision-making patterns used by professionals in this field.",
  "Develop confidence in applying the topic to real business, technical, or strategic scenarios.",
];

const buildRequirements = (category) => {
  if (category === "Software Development") {
    return [
      "Basic computer usage is enough to get started.",
      "A laptop or desktop is recommended for practice.",
      "Helpful but not mandatory: familiarity with browsers, apps, or coding basics.",
      "A valid email address is needed to receive the course PDF and updates.",
    ];
  }

  if (
    category === "Artificial Intelligence" ||
    category === "Data Science & Analytics"
  ) {
    return [
      "No advanced background is required to begin.",
      "Basic comfort with digital tools and online learning is helpful.",
      "Curiosity to explore concepts, examples, and practical use cases.",
      "A valid email address is needed to receive the course PDF and updates.",
    ];
  }

  return [
    "No prior advanced knowledge is required.",
    "Basic interest in the topic is enough to get started.",
    "A laptop, tablet, or phone can be used to access the material.",
    "A valid email address is needed to receive the course PDF and updates.",
  ];
};

const buildSyllabus = (course, category, index) => [
  {
    title: "Program Overview & Foundations",
    meta: `Section 1 • ${category} fundamentals`,
    content: (
      <p>
        Start with a clear introduction to the domain, core concepts, learning
        outcomes, and how this course is structured. This section helps the
        learner understand where the topic fits in the real world and how the
        later modules build practical depth.
      </p>
    ),
  },
  {
    title: "Core Concepts & Applied Understanding",
    meta: `Section 2 • Main concepts explained simply`,
    content: (
      <p>
        This section focuses on the central ideas behind{" "}
        <strong>{course.title}</strong>. It breaks down definitions, frameworks,
        use cases, and execution logic into easy-to-follow explanations so the
        learner can move from theory to clarity with confidence.
      </p>
    ),
  },
  {
    title: "Practical Use Cases & Industry Context",
    meta: `Section 3 • Real-world application`,
    content: (
      <p>
        Learn how these concepts are used in real business, technical, and
        operational settings. The material includes scenario-based examples,
        implementation thinking, and professional context so the learning feels
        relevant and not just conceptual.
      </p>
    ),
  },
  {
    title: "Project Thinking, Career Value & Next Steps",
    meta: `Section 4 • Outcomes and progression`,
    content: (
      <p>
        Wrap up with guidance on how to apply the learning in projects,
        interviews, job roles, leadership conversations, or personal upskilling.
        This section also outlines how to revise the PDF effectively and move
        toward more advanced learning paths after completion.
      </p>
    ),
  },
  {
    title: "Access, Delivery & Learner Support",
    meta: `Section 5 • PDF delivery and usage`,
    content: (
      <p>
        After successful purchase, the course PDF is delivered by email. This
        section explains access expectations, how to use the material for
        revision, and how the course is designed for self-paced learning over
        multiple study sessions.
      </p>
    ),
  },
];

const buildFaqs = (course, category) => [
  {
    q: "How will I receive this course?",
    a: "After purchase, the course material is shared as a PDF to the learner’s email address. It is designed for self-paced reading, revision, and repeat access.",
  },
  {
    q: "Is this course beginner friendly?",
    a: `Yes. Even when the title sounds advanced, the page experience is structured to make ${category.toLowerCase()} easier to understand through step-by-step explanations, examples, and guided sections.`,
  },
  {
    q: "Will this help with professional growth?",
    a: `Yes. ${course.title} is presented in a way that supports practical understanding, stronger domain familiarity, better project conversations, and improved confidence for interviews or role transitions.`,
  },
  {
    q: "Is this only theory or does it include practical understanding?",
    a: "The material is theory-backed but application-oriented. It includes context, use cases, execution thinking, and guidance that makes the concepts easier to apply in real scenarios.",
  },
];

const buildTestimonials = (course) => [
  {
    name: "Rahul S.",
    role: "Working Professional",
    text: `Very clean structure and surprisingly easy to follow. ${course.title} felt much more practical than I expected, and the PDF was useful even after the first reading.`,
  },
  {
    name: "Priya M.",
    role: "Career Switch Learner",
    text: "I liked that the content did not feel empty. The explanations, flow, and examples made the material feel complete and valuable for self-study.",
  },
  {
    name: "Aman K.",
    role: "Team Lead",
    text: "Good detail, strong topic coverage, and useful as a reference document. I especially liked the way the concepts were explained with professional context.",
  },
];

const enrichCourse = (course, index) => {
  const category = inferCategory(course.title, course.description);
  const level = inferLevel(course.title, course.description);
  const price = Number(course.price ?? 0);
  const mrp = Math.max(price + 1200 + (index % 5) * 350, price + 999);
  const durationWeeks = 6 + (index % 7);
  const hours = 18 + index * 2;
  const lessons = 24 + index * 3;
  const projects = 2 + (index % 4);

  return {
    ...course,
    id: String(index + 1),
    slug: slugify(course.title),
    category,
    level,
    price,
    mrp,
    imageUrl:
      course.imageUrl ||
      `https://picsum.photos/seed/${slugify(course.title)}/1200/675`,
    short_description: clampText(course.description, 200),
    rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    reviews_count: 148 + index * 17,
    students_count: 2100 + index * 287,
    instructor_name: getInstructorName(category),
    instructor_bio:
      "An experienced mentor with strong industry exposure, focused on simplifying complex topics into structured and practical learning paths. The teaching approach combines clarity, applied thinking, and career-oriented explanations that support self-paced learners.",
    duration_label: `${durationWeeks} weeks`,
    hours_label: `${hours}+ hours of guided learning`,
    lessons_label: `${lessons} lessons`,
    projects_label: `${projects} applied projects`,
    certificate_label: "Certificate of completion",
    language: "English",
    subtitles: "English",
    what_you_will_learn: buildLearnItems(course, category),
    skills: getSkillsByCategory(category),
    requirements: buildRequirements(category),
    syllabus: buildSyllabus(course, category, index),
    faqs: buildFaqs(course, category),
    testimonials: buildTestimonials(course),
    includesItems: [
      "Course material in PDF format",
      "Email delivery after purchase",
      "Self-paced learning access",
      "Beginner-friendly structure",
      "Practical explanations and examples",
      "Reusable revision material",
      "Career-oriented learning flow",
      "Certificate-ready learning journey",
    ],
    outcomes: [
      "Understand the topic with much stronger clarity and context.",
      "Build confidence in discussing the subject professionally.",
      "Use the material for revision, interview prep, or project support.",
      "Gain a more complete and structured learning experience.",
    ],
    idealFor: [
      "Beginners exploring the subject for the first time",
      "Working professionals wanting structured upskilling",
      "Students building stronger conceptual clarity",
      "Career switchers needing guided self-paced learning",
    ],
  };
};

/* ---------- SKELETON ---------- */
function SkeletonDetail() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#1c1d1f]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 animate-pulse">
              <div className="h-8 w-3/4 rounded bg-white/10" />
              <div className="mt-4 h-4 w-full rounded bg-white/10" />
              <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
              <div className="mt-6 h-4 w-48 rounded bg-white/10" />
              <div className="mt-4 h-4 w-64 rounded bg-white/10" />
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-6">
                  <div className="h-8 w-28 rounded bg-gray-200" />
                  <div className="mt-4 h-11 w-full rounded bg-gray-200" />
                  <div className="mt-3 h-11 w-full rounded bg-gray-200" />
                  <div className="mt-6 space-y-3">
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-5/6 rounded bg-gray-200" />
                    <div className="h-4 w-4/6 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 max-w-3xl animate-pulse rounded border border-gray-200 bg-white p-6">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-5 rounded bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL UI BITS ---------- */
function StarRow({ rating = 4.5, count = 128 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-bold text-[#b4690e]">{rating}</span>

      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <span
              key={i}
              className={filled ? "text-[#e59819]" : "text-gray-300"}
            >
              ★
            </span>
          );
        })}
      </div>

      <span className="text-[#5624d0] underline underline-offset-2">
        ({count.toLocaleString()} ratings)
      </span>
    </div>
  );
}

function CourseContentAccordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      {items.map((it, idx) => (
        <div
          key={it.title}
          className="border-b border-gray-200 last:border-b-0"
        >
          <button
            type="button"
            onClick={() => setOpen(open === idx ? -1 : idx)}
            className="flex w-full items-center justify-between bg-[#f7f9fa] px-4 py-4 text-left hover:bg-gray-100"
          >
            <div>
              <div className="text-sm font-bold text-gray-900">{it.title}</div>
              {it.meta ? (
                <div className="mt-1 text-xs text-gray-600">{it.meta}</div>
              ) : null}
            </div>
            <span className="text-lg font-semibold text-[#5624d0]">
              {open === idx ? "−" : "+"}
            </span>
          </button>

          {open === idx ? (
            <div className="px-4 py-4 text-sm leading-6 text-gray-700">
              {it.content}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function FAQAccordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      {items.map((item, idx) => (
        <div key={item.q} className="border-b border-gray-200 last:border-b-0">
          <button
            type="button"
            onClick={() => setOpen(open === idx ? -1 : idx)}
            className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
          >
            <span className="pr-4 text-sm font-semibold text-gray-900">
              {item.q}
            </span>
            <span className="text-lg font-semibold text-[#5624d0]">
              {open === idx ? "−" : "+"}
            </span>
          </button>

          {open === idx ? (
            <div className="px-4 pb-4 text-sm leading-6 text-gray-700">
              {item.a}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function InfoList({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 text-sm text-gray-800"
        >
          <span className="mt-0.5 text-gray-900">✓</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [pageReady, setPageReady] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  const catalog = useMemo(() => {
    return courses.map((course, index) => enrichCourse(course, index));
  }, []);

  const product = useMemo(() => {
    if (!catalog.length) return null;

    return (
      catalog.find(
        (course) =>
          course.id === id ||
          course.slug === id ||
          slugify(id || "") === course.slug,
      ) || null
    );
  }, [catalog, id]);

  useEffect(() => {
    setPageReady(false);
    const timer = setTimeout(() => setPageReady(true), 180);
    return () => clearTimeout(timer);
  }, [id]);

  const relatedCourses = useMemo(() => {
    if (!product) return [];
    return catalog.filter((course) => course.slug !== product.slug).slice(0, 3);
  }, [catalog, product]);

  const cartItem = items.find(
    (it) => it.productId === product?.slug || it.productId === product?.id,
  );
  const qtyInCart = cartItem?.quantity ?? 0;

  const price = useMemo(() => {
    return Number(product?.price ?? 0);
  }, [product]);

  const mrp = Number(product?.mrp ?? 0);
  const hasDiscount = mrp > price;
  const inStock = true;

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.slug,
      storeId: STORE_ID,
      title: product.title,
      price,
    });

    toast.success(
      qtyInCart > 0
        ? `Updated cart • ${qtyInCart + 1} in cart`
        : "Course added to cart",
    );
  };

  if (!pageReady) return <SkeletonDetail />;

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            📘
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Course not found
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            This course may no longer be available or the slug does not match.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="bg-[#1c1d1f] text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white">
              Courses
            </Link>
            <span>/</span>
            <span className="line-clamp-1 font-semibold text-white">
              {product.title}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-12">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#c0c4fc]">
                  {product.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  {product.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                {product.title}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-300">
                {product.short_description}
              </p>

              <div className="mt-4">
                <StarRow
                  rating={product.rating}
                  count={product.reviews_count}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                <span>{product.students_count.toLocaleString()} students</span>
                <span>
                  Created by{" "}
                  <span className="text-[#c0c4fc] underline underline-offset-2">
                    {product.instructor_name}
                  </span>
                </span>
                <span>Language: {product.language}</span>
                <span>{product.duration_label}</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    Learning format
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    PDF course with structured modules
                  </div>
                </div>
                <div className="rounded border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    Best for
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    Self-paced upskilling and revision
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                  PDF Course
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                  Email Delivery
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                  Self-paced
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                  Certificate-ready
                </span>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-6">
                <div className="overflow-hidden rounded border border-gray-200 bg-white text-gray-900 shadow-lg">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="text-3xl font-bold">₹{price}</div>
                      {hasDiscount ? (
                        <div className="text-base text-gray-500 line-through">
                          ₹{mrp}
                        </div>
                      ) : null}
                      {hasDiscount ? (
                        <div className="text-sm font-bold text-green-700">
                          {Math.round(((mrp - price) / mrp) * 100)}% off
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      className={[
                        "mt-5 w-full rounded border px-4 py-3 text-sm font-bold transition",
                        !inStock
                          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                          : "border-[#a435f0] bg-[#a435f0] text-white hover:bg-[#8710d8]",
                      ].join(" ")}
                    >
                      {!inStock
                        ? "Course unavailable"
                        : qtyInCart > 0
                          ? `In cart: ${qtyInCart} • Add more`
                          : "Add to cart"}
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="mt-3 w-full rounded border border-gray-900 bg-white px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50"
                    >
                      Buy now
                    </button>

                    <p className="mt-4 text-center text-xs text-gray-600">
                      30-Day Money-Back Guarantee
                    </p>

                    <div className="mt-6">
                      <h3 className="text-base font-bold text-gray-900">
                        This course includes:
                      </h3>

                      <ul className="mt-3 space-y-3 text-sm text-gray-700">
                        {product.includesItems.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 rounded bg-[#f7f9fa] p-4 text-sm text-gray-700">
                      <div className="font-bold text-gray-900">
                        PDF delivery note
                      </div>
                      <p className="mt-1">
                        The course material will be provided as a PDF and
                        emailed to the user after successful purchase. Please
                        make sure the checkout email is correct.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WHAT YOU'LL LEARN */}
          <div className="mt-10 rounded border border-gray-200 bg-white p-6 text-gray-900">
            <h2 className="text-2xl font-bold">What you’ll learn</h2>
            <div className="mt-6">
              <InfoList items={product.what_you_will_learn} />
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {/* QUICK STATS */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded border border-gray-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Duration
                  </div>
                  <div className="mt-2 text-lg font-bold text-gray-900">
                    {product.duration_label}
                  </div>
                </div>
                <div className="rounded border border-gray-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Learning hours
                  </div>
                  <div className="mt-2 text-lg font-bold text-gray-900">
                    {product.hours_label}
                  </div>
                </div>
                <div className="rounded border border-gray-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Lessons
                  </div>
                  <div className="mt-2 text-lg font-bold text-gray-900">
                    {product.lessons_label}
                  </div>
                </div>
                <div className="rounded border border-gray-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    Projects
                  </div>
                  <div className="mt-2 text-lg font-bold text-gray-900">
                    {product.projects_label}
                  </div>
                </div>
              </section>

              {/* COURSE CONTENT */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Course content
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  5 sections • Structured PDF content • Self-paced access •
                  Real-world context
                </p>

                <div className="mt-5">
                  <CourseContentAccordion items={product.syllabus} />
                </div>
              </section>

              {/* SKILLS */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Skills you’ll build
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {product.skills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded border border-gray-200 bg-[#f7f9fa] px-4 py-3 text-sm font-medium text-gray-800"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </section>

              {/* OUTCOMES */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  What this course helps you achieve
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {product.outcomes.map((item) => (
                    <div
                      key={item}
                      className="rounded border border-gray-200 p-5"
                    >
                      <div className="text-sm leading-6 text-gray-700">
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* REQUIREMENTS */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Requirements
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  {product.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* WHO THIS COURSE IS FOR */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Who this course is for
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
                  {product.idealFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* DESCRIPTION */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Description
                </h2>
                <div className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-700">
                  {product.description}
                  {"\n\n"}This page has been intentionally expanded with richer
                  dummy content so it feels complete, premium, and content-heavy
                  instead of looking like a thin product shell. It now gives the
                  learner stronger context around outcomes, structure, skills,
                  delivery, and value.
                </div>
              </section>

              {/* INSTRUCTOR */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">Instructor</h2>
                <div className="mt-4 rounded border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-[#5624d0]">
                    {product.instructor_name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {product.instructor_bio}
                  </p>
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Learner feedback
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {product.testimonials.map((item) => (
                    <div
                      key={item.name}
                      className="rounded border border-gray-200 bg-white p-5"
                    >
                      <div className="text-[#e59819]">★★★★★</div>
                      <p className="mt-3 text-sm leading-6 text-gray-700">
                        {item.text}
                      </p>
                      <div className="mt-4 text-sm font-bold text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">{item.role}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Frequently asked questions
                </h2>
                <div className="mt-5">
                  <FAQAccordion items={product.faqs} />
                </div>
              </section>
            </div>

            <div className="lg:col-span-4">
              <div className="space-y-5">
                <div className="rounded border border-gray-200 bg-[#f7f9fa] p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    Course details
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between gap-3">
                      <span>Format</span>
                      <span className="font-medium text-gray-900">PDF</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Delivery</span>
                      <span className="font-medium text-gray-900">
                        Email after purchase
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Level</span>
                      <span className="font-medium text-gray-900">
                        {product.level}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Language</span>
                      <span className="font-medium text-gray-900">
                        {product.language}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Subtitles</span>
                      <span className="font-medium text-gray-900">
                        {product.subtitles}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Certificate</span>
                      <span className="font-medium text-gray-900">
                        {product.certificate_label}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Status</span>
                      <span className="font-medium text-green-700">
                        Available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    Why learners choose this
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-gray-700">
                    <li>• Clean and structured topic flow</li>
                    <li>• Stronger context than a short product page</li>
                    <li>• Practical and career-oriented explanations</li>
                    <li>• Easy to revise after the first reading</li>
                  </ul>
                </div>

                <div className="rounded border border-gray-200 p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    Need help before buying?
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    Reach out for help with course selection, PDF delivery
                    questions, or picking the right learning path for your
                    current level.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED COURSES */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900">
              Related courses
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {relatedCourses.map((course) => (
                <Link
                  key={course.slug}
                  to={`/products/${course.slug}`}
                  className="overflow-hidden rounded border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-wide text-[#5624d0]">
                      {course.category}
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900">
                      {course.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                      {course.short_description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
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
          </section>
        </div>
      </section>
    </div>
  );
}
