import React from "react";
import { useCurrentFrame, useVideoConfig, Sequence, interpolate } from "remotion";
import { BRAND, computeTiming } from "./theme";
import { FadeIn, TypeWriter, CategoryBadge } from "./components";
import { SAFE, SAFE_BOX, RESERVED } from "./safeZones";

type OPAVideoProps = {
  hook: string;
  steps: string[];
  prompt: string;
  result: string;
  cta: string;
  category: "prompt-lab" | "tool-drop" | "behind-the-prompt";
  brandTag: string;
  /** Το κουμπί εγγραφής στην τελική κάρτα. */
  subscribeCta?: string;
  /** Η σημείωση κάτω από το κουμπί — τι κερδίζει ο χρήστης. */
  subscribeNote?: string;
  /** Δείχνει με κόκκινο τι σκεπάζει το UI των πλατφορμών. Μόνο για έλεγχο. */
  debugSafe?: boolean;
};

/**
 * Κλίμακα τυπογραφίας για καμβά 1080×1920.
 *
 * Το βίντεο το βλέπουν σε κινητό ~400px πλάτους, δηλαδή σμικρυμένο
 * κατά 2.7 φορές. Ό,τι φαίνεται «κανονικό» πάνω στον καμβά βγαίνει
 * μικρό στο τηλέφωνο — γι' αυτό όλα είναι αισθητά μεγαλύτερα από ό,τι
 * θα έβαζες σε σελίδα.
 */
const TYPE = {
  hook: 78,
  step: 46,
  stepNum: 32,
  termTitle: 22,
  prompt: 34,
  result: 44,
  cta: 62,
  tag: 42,
  note: 34,
  logo: 30,
} as const;

/**
 * Όλο το κείμενο ζει μέσα στο SAFE_BOX. Τα διακοσμητικά (πλέγμα,
 * λάμψη) επιτρέπεται να φτάνουν στα άκρα — αν τα σκεπάσει το UI της
 * πλατφόρμας, δεν χάνεται πληροφορία.
 */
const BAR_ROOM = 40;   // χώρος για τη μπάρα προόδου στο κάτω όριο
const NAV_H = 76;      // ύψος της nav μπάρας
const NAV_GAP = 34;    // απόσταση nav από το περιεχόμενο

// Το περιεχόμενο ξεκινά ΚΑΤΩ από τη nav, που με τη σειρά της ξεκινά
// στην αρχή της ζώνης ασφαλείας — ποτέ πάνω από αυτήν.
const SAFE_PAD = [
  `${SAFE.top + NAV_H + NAV_GAP}px`,
  `${SAFE.right}px`,
  `${SAFE.bottom + BAR_ROOM}px`,
  `${SAFE.left}px`,
].join(" ");

/** Το λογότυπο του site, ίδιο με το nav: "> OnePromptAway". */
const Logo: React.FC = () => (
  <div
    style={{
      fontFamily: BRAND.fonts.mono,
      fontSize: TYPE.logo,
      fontWeight: 700,
      color: BRAND.colors.text,
    }}
  >
    <span style={{ color: BRAND.colors.muted }}>{"> "}</span>
    One<span style={{ color: BRAND.colors.teal }}>Prompt</span>Away
  </div>
);

export const OPAVideo: React.FC<OPAVideoProps> = ({
  hook,
  steps,
  prompt,
  result,
  cta,
  category,
  brandTag,
  subscribeCta = "Εγγραφή στο oneprompt.gr",
  subscribeNote = "Κάθε Δευτέρα ένα νέο άρθρο",
  debugSafe = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const catColor = BRAND.categoryColors[category] || BRAND.colors.teal;

  // Ο χρονισμός βγαίνει από το ίδιο το κείμενο — δες computeTiming
  // στο theme.ts για το γιατί.
  const T = computeTiming(
    { hook, steps, prompt, result, cta, subscribeCta, subscribeNote },
    fps
  );

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        width,
        height,
        backgroundColor: BRAND.colors.dark,
        display: "flex",
        flexDirection: "column",
        fontFamily: BRAND.fonts.sans,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Πλέγμα φόντου */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${catColor}08 1px, transparent 1px),
            linear-gradient(90deg, ${catColor}08 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: -200,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${catColor}15, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* ===== SECTION 1: HOOK ===== */}
      <Sequence from={T.hookStart} durationInFrames={T.hookDur}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            padding: SAFE_PAD,
          }}
        >
          <FadeIn delay={3}>
            <CategoryBadge category={category} />
          </FadeIn>
          <FadeIn delay={10}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: TYPE.hook,
                fontWeight: 700,
                color: BRAND.colors.text,
                textAlign: "center",
                lineHeight: 1.25,
              }}
            >
              {hook}
            </div>
          </FadeIn>
          <FadeIn delay={20}>
            {/* Ο κέρσορας που αναβοσβήνει, όπως στο terminal της αρχικής */}
            <div
              style={{
                width: 22,
                height: 56,
                backgroundColor: BRAND.colors.teal,
                opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0.15,
              }}
            />
          </FadeIn>
        </div>
      </Sequence>

      {/* ===== SECTION 2: BODY ===== */}
      <Sequence from={T.bodyStart} durationInFrames={T.bodyDur}>
        {/* space-between: βήματα ψηλά, prompt στο κέντρο, αποτέλεσμα
            χαμηλά. Γεμίζει το κάδρο και δίνει καθαρή σειρά ανάγνωσης. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: SAFE_PAD,
          }}
        >
          {/* Βήματα ως κάρτες — ίδιο λεξιλόγιο με τις κάρτες άρθρων */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {steps.map((step, i) => (
              <FadeIn key={i} delay={T.stepDelays[i]}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 26,
                    backgroundColor: BRAND.colors.surface,
                    border: `2px solid ${BRAND.colors.border}`,
                    borderRadius: 18,
                    padding: "26px 30px",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      backgroundColor: `${catColor}20`,
                      border: `2px solid ${catColor}50`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: BRAND.fonts.mono,
                      fontSize: TYPE.stepNum,
                      fontWeight: 700,
                      color: catColor,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: TYPE.step,
                      color: BRAND.colors.text,
                      lineHeight: 1.35,
                      fontWeight: 500,
                    }}
                  >
                    {step}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Terminal — αντίγραφο του terminal block της αρχικής */}
          <FadeIn delay={T.promptDelay}>
            <div
              style={{
                backgroundColor: BRAND.colors.surface,
                border: `2px solid ${BRAND.colors.border}`,
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "18px 26px",
                  borderBottom: `1px solid ${BRAND.colors.border}`,
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#EF444499" }} />
                <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#EAB30899" }} />
                <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#22C55E99" }} />
                <span
                  style={{
                    marginLeft: 14,
                    fontFamily: BRAND.fonts.mono,
                    fontSize: TYPE.termTitle,
                    color: BRAND.colors.muted,
                  }}
                >
                  prompt
                </span>
              </div>
              <div style={{ padding: "30px 32px", minHeight: 160 }}>
                <TypeWriter
                  text={`> ${prompt}`}
                  startFrame={T.typeStart}
                  speed={T.typeSpeed}
                  style={{
                    fontSize: TYPE.prompt,
                    color: BRAND.colors.text,
                    lineHeight: 1.55,
                  }}
                />
              </div>
            </div>
          </FadeIn>

          {/* Αποτέλεσμα — το πράσινο ✓ του terminal της αρχικής */}
          <FadeIn delay={T.resultDelay}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  fontSize: TYPE.result,
                  color: "#4ADE80",
                  fontFamily: BRAND.fonts.mono,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: TYPE.result,
                  color: BRAND.colors.text,
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                {result}
              </div>
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* ===== SECTION 3: CTA ===== */}
      <Sequence from={T.ctaStart} durationInFrames={T.ctaDur}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            padding: SAFE_PAD,
          }}
        >
          <FadeIn delay={3}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: TYPE.cta,
                fontWeight: 700,
                color: BRAND.colors.text,
                textAlign: "center",
                lineHeight: 1.25,
              }}
            >
              {cta}
            </div>
          </FadeIn>
          <FadeIn delay={14}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
              }}
            >
              {/* Το teal κουμπί του site: γεμάτο teal, σκούρο κείμενο */}
              <div
                style={{
                  padding: "24px 52px",
                  borderRadius: 14,
                  backgroundColor: BRAND.colors.teal,
                  fontFamily: BRAND.fonts.mono,
                  fontSize: TYPE.tag,
                  fontWeight: 700,
                  color: BRAND.colors.dark,
                  textAlign: "center",
                }}
              >
                {subscribeCta}
              </div>
              <div
                style={{
                  fontSize: TYPE.note,
                  color: BRAND.colors.muted,
                  textAlign: "center",
                  lineHeight: 1.35,
                }}
              >
                {subscribeNote}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={24}>
            <div
              style={{
                fontFamily: BRAND.fonts.mono,
                fontSize: TYPE.tag - 8,
                color: BRAND.colors.muted,
              }}
            >
              {brandTag}
            </div>
          </FadeIn>
        </div>
      </Sequence>

      {/* ===== Μόνιμα στοιχεία, σε κάθε καρέ ===== */}

      {/* Nav μπάρα — κάθεται ΜΕΣΑ στη ζώνη ασφαλείας, αλλιώς την
          σκεπάζουν τα tabs της πλατφόρμας. */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.left,
          right: SAFE.right,
          height: NAV_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${BRAND.colors.border}`,
        }}
      >
        <Logo />
        <span
          style={{
            fontFamily: BRAND.fonts.mono,
            fontSize: 24,
            color: BRAND.colors.muted,
          }}
        >
          oneprompt.gr
        </span>
      </div>

      {/* Μπάρα προόδου — στο ΚΑΤΩ ΟΡΙΟ της ζώνης, όχι στο κάτω άκρο
          του κάδρου, που το τρώει η λεζάντα. */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + SAFE_BOX.height - 8,
          left: SAFE.left,
          right: SAFE.right,
          height: 8,
          borderRadius: 4,
          backgroundColor: BRAND.colors.border,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: catColor,
          }}
        />
      </div>

      {/* Debug overlay: τι σκεπάζει το UI των πλατφορμών. */}
      {debugSafe && (
        <>
          {RESERVED.map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "top" in r ? r.top : undefined,
                bottom: "bottom" in r ? r.bottom : undefined,
                left: "left" in r ? r.left : undefined,
                right: "right" in r ? r.right : undefined,
                width: "width" in r ? r.width : undefined,
                height: "height" in r ? r.height : undefined,
                backgroundColor: "#EF444433",
                border: "3px dashed #EF4444AA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                whiteSpace: "pre-line",
                fontFamily: BRAND.fonts.mono,
                fontSize: 26,
                color: "#FCA5A5",
              }}
            >
              {r.label}
            </div>
          ))}
        </>
      )}

    </div>
  );
};
