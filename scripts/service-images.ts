// Service Image Mapping - Curated Unsplash Stock Photos
// Each service maps to a relevant, high-quality Unsplash image URL

export const serviceImages: Record<string, string> = {
  // ── Admission Counseling (8 services) ────────────────────────────────────
  "Quick Admission Query - 15 Min Chat":
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop",
  
  "College Shortlisting Basics":
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
  
  "Stream Selection Counseling (10th/12th)":
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
  
  "College Interview Preparation":
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
  
  "School Admission Guidance":
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop",
  
  "MBA Admission Strategy Session":
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
  
  "Profile Building for Top Universities":
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop",
  
  "Premium Admission Package - End to End":
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",

  // ── Academic Assistance (8 services) ─────────────────────────────────────
  "Parent Guidance Session - Basics":
    "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&h=600&fit=crop",
  
  "Study Skills & Time Management Coaching":
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
  
  "Online Tutoring Session - Mathematics":
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
  
  "English Writing Improvement Workshop":
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
  
  "Board Exam Preparation Strategy":
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  
  "Science Lab Report Review & Guidance":
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
  
  "Language Learning Consultation":
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop",
  
  "Comprehensive Academic Support Package":
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",

  // ── Study Abroad (7 services) ────────────────────────────────────────────
  "Visa Interview Tips - Quick Guide":
    "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&h=600&fit=crop",
  
  "Country Comparison & Fit Analysis":
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
  
  "Germany Public University Guidance":
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
  
  "Canada Study Permit & Admission Help":
    "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&h=600&fit=crop",
  
  "Australia Admission & Visa Package":
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&h=600&fit=crop",
  
  "UK University Admission & SOP Package":
    "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop",
  
  "USA University Application Package":
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",

  // ── Application Services (7 services) ────────────────────────────────────
  "LOR & Recommendation Letter Review":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
  
  "SOP & Essay Proofreading - Basic":
    "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&h=600&fit=crop",
  
  "Cover Letter Writing Service":
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
  
  "Resume/CV Building - Professional":
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop",
  
  "LinkedIn Profile Optimization":
    "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=600&fit=crop",
  
  "College Essay Brainstorming Session":
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=600&fit=crop",
  
  "Complete Application Package":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
};

/**
 * Get a relevant image URL for a service name
 * Falls back to a generic education image if no match found
 */
export function getServiceImage(serviceName: string): string {
  return serviceImages[serviceName] || 
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop";
}

/**
 * Get all service image mappings
 */
export function getAllServiceImages(): Record<string, string> {
  return serviceImages;
}
