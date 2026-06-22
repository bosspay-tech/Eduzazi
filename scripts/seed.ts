import 'dotenv/config';
import connectDB from '../lib/db';
import { Product } from '../lib/models';

// Clean, portable list of products fetched from the original database.
// This array contains no database-specific metadata (like id, createdAt, etc.)
// making it extremely easy to adapt to any database engine (MongoDB, MySQL, PostgreSQL, etc.)
const products = [
  {
    "name": "Complete Application Package",
    "description": "End-to-end application processing for up to 5 colleges including form filling, SOP writing, LOR review, document verification, and submission tracking.",
    "price": 5000,
    "discount": 0,
    "category": "Application Services",
    "size": [],
    "color": [],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": "",
    "downloadLink": "",
    "rating": 4.9,
    "reviews": [
      {
        "text": "Managed 5 applications flawlessly. Highly professional.",
        "rating": 5
      },
      {
        "text": "End-to-end support made the process stress-free.",
        "rating": 5
      }
    ]
  },
  {
    "name": "College Essay Brainstorming Session",
    "description": "One-on-one brainstorming session to help you identify compelling personal stories, unique angles, and powerful topics for college essays.",
    "price": 2250,
    "discount": 0,
    "category": "Application Services",
    "size": [
      "60-Minute Session",
      "Topic Ideas",
      "Outline Draft",
      "Resource Guide"
    ],
    "color": [
      "Essay Strategist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.7,
    "reviews": [
      {
        "text": "Found the perfect essay topic I never would have thought of.",
        "rating": 5
      },
      {
        "text": "The session gave me so many ideas to work with.",
        "rating": 5
      }
    ]
  },
  {
    "name": "LinkedIn Profile Optimization",
    "description": "Complete LinkedIn profile makeover including headline optimization, summary writing, experience section enhancement, and recommendation strategy.",
    "price": 1600,
    "discount": 0,
    "category": "Application Services",
    "size": [],
    "color": [],
    "stock": 9999,
    "image": "https://plus.unsplash.com/premium_photo-1691962725045-57ff9e77f0bd?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [],
    "pdfUrl": "",
    "downloadLink": "",
    "rating": 4.5,
    "reviews": [
      {
        "text": "Profile views increased 300% after optimization. Amazing!",
        "rating": 5
      }
    ]
  },
  {
    "name": "Resume/CV Building - Professional",
    "description": "Professional resume or CV creation tailored to your target industry. Includes ATS-optimized formatting, keyword optimization, and cover letter draft.",
    "price": 1050,
    "discount": 0,
    "category": "Application Services",
    "size": [
      "Professional CV",
      "ATS Optimization",
      "Cover Letter Draft",
      "2 Revisions"
    ],
    "color": [
      "Resume Specialist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.6,
    "reviews": [
      {
        "text": "My new CV got me 3 interview callbacks in the first week.",
        "rating": 5
      },
      {
        "text": "Very professional and tailored to my field.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Cover Letter Writing Service",
    "description": "Custom cover letter writing tailored to specific job descriptions or university applications. Includes 2 drafts and revision.",
    "price": 800,
    "discount": 0,
    "category": "Application Services",
    "size": [
      "Custom Cover Letter",
      "2 Drafts",
      "Unlimited Revisions"
    ],
    "color": [
      "Cover Letter Writer"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.4,
    "reviews": [
      {
        "text": "Tailored perfectly to each job I applied for. Got 2 interviews.",
        "rating": 5
      }
    ]
  },
  {
    "name": "SOP & Essay Proofreading - Basic",
    "description": "Get your SOP or essay proofread for grammar, spelling, and basic structure. Quick turnaround within 48 hours.",
    "price": 550,
    "discount": 0,
    "category": "Application Services",
    "size": [
      "Proofreading",
      "Grammar Check",
      "48-Hour Delivery"
    ],
    "color": [
      "Content Reviewer"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.3,
    "reviews": [
      {
        "text": "Caught many errors I missed. Quick service.",
        "rating": 4
      }
    ]
  },
  {
    "name": "LOR & Recommendation Letter Review",
    "description": "Expert review of your Letter of Recommendation with feedback on structure, content, and effectiveness.",
    "price": 350,
    "discount": 0,
    "category": "Application Services",
    "size": [
      "Single LOR Review",
      "Feedback Report",
      "Suggestions"
    ],
    "color": [
      "LOR Specialist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.1,
    "reviews": [
      {
        "text": "Good feedback, improved my LOR quality.",
        "rating": 4
      }
    ]
  },
  {
    "name": "USA University Application Package",
    "description": "Comprehensive package for US university applications including Common App guidance, essay reviews, activity list optimization, and interview prep.",
    "price": 4500,
    "discount": 0,
    "category": "Study Abroad",
    "size": [
      "Common App Guidance",
      "5 Essay Reviews",
      "Activity List",
      "Interview Prep"
    ],
    "color": [
      "US Admissions Specialist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.9,
    "reviews": [
      {
        "text": "Got into 3 US universities including my dream school!",
        "rating": 5
      },
      {
        "text": "The essay reviews were invaluable. Worth every penny.",
        "rating": 5
      }
    ]
  },
  {
    "name": "UK University Admission & SOP Package",
    "description": "End-to-end support for UK UCAS applications including personal statement writing, university selection, and scholarship guidance.",
    "price": 3000,
    "discount": 0,
    "category": "Study Abroad",
    "size": [
      "UCAS Personal Statement",
      "University Shortlisting",
      "Scholarship Help",
      "3 Sessions"
    ],
    "color": [
      "UK Admissions Consultant"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.8,
    "reviews": [
      {
        "text": "The personal statement was polished to perfection. Got 5 offers!",
        "rating": 5
      },
      {
        "text": "Very knowledgeable about UK university system.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Australia Admission & Visa Package",
    "description": "Complete guidance for Australian university admissions and student visa (subclass 500) including GTE statement and financial proof assistance.",
    "price": 1750,
    "discount": 0,
    "category": "Study Abroad",
    "size": [
      "University Shortlisting",
      "GTE Statement",
      "Visa Assistance"
    ],
    "color": [
      "Australia Education Specialist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.6,
    "reviews": [
      {
        "text": "GTE statement writing was excellent. Visa approved first time.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Canada Study Permit & Admission Help",
    "description": "Complete assistance for Canadian study permits including SDS documentation, university selection, and visa application guidance.",
    "price": 1000,
    "discount": 0,
    "category": "Study Abroad",
    "size": [],
    "color": [],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1567762328132-9c6867ebb02e?q=80&w=882&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [],
    "pdfUrl": "",
    "downloadLink": "",
    "rating": 4.7,
    "reviews": [
      {
        "text": "Got my Canadian study permit approved in just 3 weeks!",
        "rating": 5
      },
      {
        "text": "SDS documentation guidance was very detailed.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Germany Public University Guidance",
    "description": "Expert guidance for admission to tuition-free German public universities including language preparation, uni-assist application, and blocked account help.",
    "price": 750,
    "discount": 0,
    "category": "Study Abroad",
    "size": [
      "University Shortlisting",
      "uni-assist Application",
      "Language Guidance"
    ],
    "color": [
      "Germany Education Consultant"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.7,
    "reviews": [
      {
        "text": "Got into TU Munich with their guidance. Amazing service!",
        "rating": 5
      },
      {
        "text": "uni-assist process was confusing but they made it easy.",
        "rating": 4
      }
    ]
  },
  {
    "name": "Country Comparison & Fit Analysis",
    "description": "Detailed comparison of study abroad destinations including cost of living, education quality, work opportunities, and post-study visa policies.",
    "price": 500,
    "discount": 0,
    "category": "Study Abroad",
    "size": [
      "3-Country Comparison",
      "Cost Analysis",
      "Report"
    ],
    "color": [
      "Study Abroad Analyst"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.5,
    "reviews": [
      {
        "text": "Helped me narrow down my options to 2 countries.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Visa Interview Tips - Quick Guide",
    "description": "Quick consultation covering essential visa interview tips, common questions, and documentation checklist for one country.",
    "price": 200,
    "discount": 0,
    "category": "Study Abroad",
    "size": [],
    "color": [],
    "stock": 9999,
    "image": "https://plus.unsplash.com/premium_photo-1663075939035-a0ed8b6307eb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [],
    "pdfUrl": "",
    "downloadLink": "",
    "rating": 4.4,
    "reviews": [
      {
        "text": "Simple tips that made a big difference in my confidence.",
        "rating": 4
      }
    ]
  },
  {
    "name": "Comprehensive Academic Support Package",
    "description": "Complete academic guidance including study planning, subject tutoring, exam preparation, and 3-month follow-up support for school/college students.",
    "price": 2500,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "4 Tutoring Sessions",
      "Study Plan",
      "Exam Strategy",
      "3-Month Support"
    ],
    "color": [
      "Senior Academic Mentor"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.8,
    "reviews": [
      {
        "text": "All-round academic improvement. My grades went from B to A.",
        "rating": 5
      },
      {
        "text": "The follow-up support kept me on track.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Language Learning Consultation",
    "description": "Personalized guidance for learning foreign languages including German, French, Spanish, or Japanese for academic and career growth.",
    "price": 1500,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "Language Assessment",
      "2 Sessions",
      "Resource Kit",
      "Study Plan"
    ],
    "color": [
      "Language Specialist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.5,
    "reviews": [
      {
        "text": "Got a clear roadmap for learning German efficiently.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Science Lab Report Review & Guidance",
    "description": "Expert review of science lab reports for physics, chemistry, and biology with feedback on methodology, analysis, and presentation format.",
    "price": 1100,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "Single Report Review",
      "Detailed Feedback",
      "Format Guide"
    ],
    "color": [
      "Science Mentor"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.3,
    "reviews": [
      {
        "text": "Helped me understand what was wrong with my analysis section.",
        "rating": 4
      }
    ]
  },
  {
    "name": "Board Exam Preparation Strategy",
    "description": "Personalized study plan and exam strategy for CBSE/ICSE board exams including time management, revision techniques, and subject prioritization.",
    "price": 850,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "Personalized Study Plan",
      "2 Sessions",
      "Revision Strategy"
    ],
    "color": [
      "Academic Strategist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.7,
    "reviews": [
      {
        "text": "My board score improved by 12% after following this plan.",
        "rating": 5
      },
      {
        "text": "Very practical revision techniques. Highly recommended.",
        "rating": 5
      }
    ]
  },
  {
    "name": "English Writing Improvement Workshop",
    "description": "Intensive workshop on academic and creative writing skills including essay structure, vocabulary building, and grammar mastery for students.",
    "price": 650,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "3 Workshop Sessions",
      "Writing Prompts",
      "Personal Feedback"
    ],
    "color": [
      "Writing Coach"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.5,
    "reviews": [
      {
        "text": "My essay writing improved dramatically after these workshops.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Online Tutoring Session - Mathematics",
    "description": "One-on-one online tutoring for mathematics covering algebra, calculus, statistics, or competitive math. Tailored to your syllabus and pace.",
    "price": 450,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "60-Minute Session",
      "Customized Content",
      "Practice Problems"
    ],
    "color": [
      "Math Tutor"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.6,
    "reviews": [
      {
        "text": "Finally understood calculus! The tutor explains so clearly.",
        "rating": 5
      },
      {
        "text": "Great for clearing doubts before exams.",
        "rating": 4
      }
    ]
  },
  {
    "name": "Study Skills & Time Management Coaching",
    "description": "Learn effective study techniques, note-taking methods, Pomodoro strategies, and exam preparation schedules for maximum academic performance.",
    "price": 300,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "2 Coaching Sessions",
      "Custom Planner",
      "Technique Guide"
    ],
    "color": [
      "Study Skills Coach"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.4,
    "reviews": [
      {
        "text": "Changed how I study. Productivity went through the roof.",
        "rating": 5
      },
      {
        "text": "The custom planner was a game-changer.",
        "rating": 4
      }
    ]
  },
  {
    "name": "Parent Guidance Session - Basics",
    "description": "A 20-minute session helping parents understand modern education options and how to guide their children through academic decisions.",
    "price": 150,
    "discount": 0,
    "category": "Academic Assistance",
    "size": [
      "20-Minute Session",
      "Basic Guidance",
      "Resource List"
    ],
    "color": [
      "Family Counselor"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.3,
    "reviews": [
      {
        "text": "Helped me understand what my child needs academically.",
        "rating": 4
      }
    ]
  },
  {
    "name": "Premium Admission Package - End to End",
    "description": "Complete admission support from college shortlisting, application processing, SOP writing, interview prep to final admission confirmation.",
    "price": 3500,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [
      "College Shortlisting",
      "Application Processing",
      "SOP Writing",
      "Interview Prep"
    ],
    "color": [
      "Lead Admission Consultant"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.9,
    "reviews": [
      {
        "text": "Managed my entire admission process flawlessly.",
        "rating": 5
      },
      {
        "text": "Worth every penny. Got into my top choice.",
        "rating": 5
      }
    ]
  },
  {
    "name": "Profile Building for Top Universities",
    "description": "Strategic profile building guidance for top-tier universities including extracurricular planning, project guidance, and portfolio development over 4 months.",
    "price": 2000,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [
      "4-Month Plan",
      "Monthly Sessions",
      "Activity Planning",
      "Portfolio Review"
    ],
    "color": [
      "Senior Admission Consultant"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.8,
    "reviews": [
      {
        "text": "Transformed my profile completely. Got into my dream university.",
        "rating": 5
      }
    ]
  },
  {
    "name": "MBA Admission Strategy Session",
    "description": "Specialized counseling for MBA aspirants covering top B-school selection, GMAT/GRE strategy, application timeline, and essay brainstorming.",
    "price": 1250,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [
      "2 Strategy Sessions",
      "School Shortlisting",
      "GMAT Guidance"
    ],
    "color": [
      "MBA Admission Expert"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.7,
    "reviews": [
      {
        "text": "Got clarity on which B-schools to target for my profile.",
        "rating": 5
      },
      {
        "text": "The GMAT strategy tips saved me months of prep.",
        "rating": 5
      }
    ]
  },
  {
    "name": "School Admission Guidance",
    "description": "Navigate the complex school admissions process with expert planning, documentation assistance, and profile building for K-12 students.",
    "price": 900,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [
      "School Shortlisting",
      "Document Review",
      "Interview Prep"
    ],
    "color": [
      "Admissions Specialist"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.5,
    "reviews": [
      {
        "text": "Simplified the entire documentation phase for my child's school entry.",
        "rating": 5
      }
    ]
  },
  {
    "name": "College Interview Preparation",
    "description": "Mock interview session with expert feedback to prepare for college admission interviews. Includes common questions and communication tips.",
    "price": 600,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [],
    "color": [],
    "stock": 9999,
    "image": "https://plus.unsplash.com/premium_photo-1676666379090-e0fc81f41e7e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [],
    "pdfUrl": "",
    "downloadLink": "",
    "rating": 4.7,
    "reviews": [
      {
        "text": "Boosted my confidence. Cracked the interview!",
        "rating": 5
      }
    ]
  },
  {
    "name": "Stream Selection Counseling (10th/12th)",
    "description": "Expert guidance to help students choose the right stream after 10th or 12th based on aptitude assessment and market trends.",
    "price": 400,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [
      "Aptitude Assessment",
      "1 Counseling Session",
      "Career Report"
    ],
    "color": [
      "Academic Advisor"
    ],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.6,
    "reviews": [
      {
        "text": "The aptitude test was very insightful. Chose Science with confidence.",
        "rating": 5
      },
      {
        "text": "Great career mapping for my daughter.",
        "rating": 4
      }
    ]
  },
  {
    "name": "College Shortlisting Basics",
    "description": "Get a personalized shortlist of colleges based on your academic profile, budget, and preferred location.",
    "price": 250,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [],
    "color": [],
    "stock": 9999,
    "image": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [],
    "pdfUrl": "",
    "downloadLink": "",
    "rating": 4.3,
    "reviews": [
      {
        "text": "Got a clear list of colleges I can target.",
        "rating": 4
      }
    ]
  },
  {
    "name": "Quick Admission Query - 15 Min Chat",
    "description": "A 15-minute quick consultation for urgent admission queries, confusion resolution, or basic guidance from a counselor.",
    "price": 100,
    "discount": 0,
    "category": "Admission Counseling",
    "size": [
      "15-Minute Call",
      "Quick Advice",
      "Basic Direction"
    ],
    "color": [
      "Junior Counselor"
    ],
    "stock": 9999,
    "image": "https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "images": [],
    "pdfUrl": null,
    "downloadLink": "",
    "rating": 4.2,
    "reviews": [
      {
        "text": "Quick help when I was confused about my next step.",
        "rating": 4
      },
      {
        "text": "Affordable and helpful for basic doubts.",
        "rating": 4
      }
    ]
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to database...');

    console.log('Clearing existing products...');
    const deleteRes = await Product.deleteMany({});
    console.log(`Cleared existing products (deleted ${deleteRes.deletedCount || 0} products).`);

    console.log(`Inserting ${products.length} products...`);
    const insertRes = await Product.insertMany(products);
    console.log(`✅ Successfully seeded database with ${insertRes.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();
