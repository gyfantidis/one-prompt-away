/**
 * ArticleCover — αυτόματο εξώφυλλο άρθρου, χωρίς αρχείο εικόνας.
 *
 * Καθαρή κλίση στο χρώμα της κατηγορίας + διακριτικό πλέγμα κουκκίδων.
 * Καμία μορφή που μιμείται περιεχόμενο, ώστε να μη διαβάζεται ως
 * skeleton loader.
 *
 * Υλοποιείται με CSS gradients αντί για SVG: δεν υπάρχει viewBox να
 * κοπεί, οπότε δουλεύει σε ΚΑΘΕ αναλογία — από λεπτή λωρίδα κάρτας
 * μέχρι πλατύ hero.
 *
 * Ντετερμινιστικό: το ίδιο slug δίνει πάντα την ίδια κλίση, αλλά κάθε
 * άρθρο παίρνει διαφορετική γωνία και θέση φωτισμού.
 */

const CATEGORY_COLOR: Record<string, string> = {
  "prompt-lab": "#2DD4BF",
  "tool-drop": "#60A5FA",
  "behind-the-prompt": "#C084FC",
};

const FALLBACK_COLOR = "#2DD4BF";

/** Γωνίες κλίσης — αρκετά διαφορετικές ώστε να ξεχωρίζουν μεταξύ τους. */
const ANGLES = [115, 135, 155, 200, 225, 245];

/** FNV-1a — σταθερό hash ώστε το σχέδιο να μην αλλάζει μεταξύ builds. */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  // Τελικό ανακάτεμα (murmur3 finalizer): χωρίς αυτό τα χαμηλά bits του
  // FNV είναι μεροληπτικά και τα περισσότερα slugs έπεφταν στην ίδια γωνία.
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

export interface ArticleCoverProps {
  slug: string;
  category: string;
  /** Κλάσεις για το container — εκεί ορίζεται και το ύψος/aspect ratio. */
  className?: string;
}

export default function ArticleCover({
  slug,
  category,
  className = "",
}: ArticleCoverProps) {
  const color = CATEGORY_COLOR[category] ?? FALLBACK_COLOR;
  const seed = hashString(slug);

  const angle = ANGLES[seed % ANGLES.length];
  // Θέση του φωτεινού σημείου, σε ποσοστό — σταθερή ανά άρθρο.
  const glowX = 8 + ((seed >>> 3) % 34);
  const glowY = 6 + ((seed >>> 7) % 26);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: "#161B22" }}
      role="presentation"
      aria-hidden="true"
    >
      {/* Πλέγμα κουκκίδων */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(230,237,243,0.055) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Κύρια κλίση στο χρώμα της κατηγορίας */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, ${color}3D 0%, ${color}0F 45%, transparent 78%)`,
        }}
      />

      {/* Απαλός φωτισμός — δίνει βάθος και ξεχωρίζει κάθε άρθρο */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(60% 95% at ${glowX}% ${glowY}%, ${color}2B 0%, transparent 70%)`,
        }}
      />

      {/* Γραμμή έμφασης στη βάση */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: 3, backgroundColor: color, opacity: 0.55 }}
      />
    </div>
  );
}
