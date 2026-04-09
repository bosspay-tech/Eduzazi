import { useState } from "react";

const TYPE_DATA = [
  { type: "Development" },
  { type: "Business" },
  { type: "Finance And Accounting" },
  { type: "Personal Development" },
  { type: "IT & Software" },
  { type: "Design" },
  { type: "Marketing" },
  { type: "Lifestyle" },
  { type: "Photography & Video" },
  { type: "Health & Fitness" },
  { type: "Music" },
  { type: "Teaching & Academics" },
  { type: "Data Science" },
  { type: "Artificial Intelligence" },
  { type: "Cyber Security" },
  { type: "Cloud Computing" },
  { type: "Project Management" },
  { type: "Communication Skills" },
  { type: "Language Learning" },
  { type: "Entrepreneurship" },
];

export default function CourseActionBar() {
  const [active, setActive] = useState("Development");

  return (
    <div className="w-full bg-white sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-4">
          {TYPE_DATA.map((item) => {
            const isActive = active === item.type;

            return (
              <button
                key={item.type}
                onClick={() => setActive(item.type)}
                className={`flex items-center gap-2 whitespace-nowrap pb-2 transition-all border-b-2 ${
                  isActive
                    ? "border-black text-black font-semibold"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                <span className="text-sm">{item.type}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
