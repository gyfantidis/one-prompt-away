export type Locale = "el" | "en";
export const defaultLocale: Locale = "el";
export const locales: Locale[] = ["el", "en"];

const el = {
  nav: {
    articles: "Άρθρα",
    about: "Σχετικά",
    backHome: "Αρχική",
    backArticles: "Όλα τα άρθρα",
  },
  home: {
    heroPrefix: "Ένα",
    heroHighlight: "prompt",
    heroSuffix: "σε χωρίζει.",
    heroSubtext:
      "Πρακτικοί οδηγοί για AI tools και prompts στα Ελληνικά. Κάθε εβδομάδα, ένα πρόβλημα — μία AI λύση.",
    cta: "Δες τα άρθρα",
    pillarsTitle: "Τι θα βρεις εδώ",
    recentTitle: "Τελευταία άρθρα",
    seeAll: "Όλα →",
    readingTime: "ανάγνωση",
    newsletterTitle: "Μείνε updated",
    newsletterText:
      "Ένα email την εβδομάδα με το καλύτερο AI prompt ή tool. Χωρίς spam, χωρίς hype.",
    newsletterPlaceholder: "to-email-sou@example.gr",
    newsletterButton: "Εγγραφή",
    terminalRead: "Διάβασε πώς το έφτιαξα →",
    terminalTopic: '"weekly meal plan"',
    terminalLine1: "Φτιάξε μου ένα εβδομαδιαίο meal plan για 2 άτομα,",
    terminalLine2: "μεσογειακή διατροφή, budget €50, με λίστα για σούπερ μάρκετ.",
    terminalCheck1: "Meal plan generated in 28s",
    terminalCheck2: "Shopping list: 23 items, estimated €47.50",
  },
  articles: {
    title: "Άρθρα",
    subtitle:
      "Πρακτικοί οδηγοί για AI tools και prompts. Κάθε εβδομάδα κάτι καινούριο.",
    allFilter: "Όλα",
    readingTime: "ανάγνωση",
    empty: "Δεν υπάρχουν άρθρα σε αυτή την κατηγορία ακόμα.",
    emptyTagline: "Ένα prompt σε χωρίζει.",
  },
  article: {
    ctaTitle: "Σου άρεσε αυτό;",
    ctaText:
      "Κάθε εβδομάδα δημοσιεύω νέο content για AI tools και prompts. Follow στο TikTok ή εγγράψου στο newsletter.",
  },
  about: {
    metaTitle: "Σχετικά",
    metaDesc:
      "Τι είναι το One Prompt Away, ποιος το φτιάχνει και γιατί. Πρακτικοί οδηγοί για AI tools και prompts στα ελληνικά.",
    whoami: "> whoami",
    title: "Σχετικά με το",
    intro:
      "Ένα ελληνικό blog για όσους θέλουν να χρησιμοποιούν τα AI tools σωστά — όχι θεωρητικά, αλλά στην πράξη.",
    p1: "Βρίσκομαι στα AI tools κάθε μέρα — δοκιμάζω, σπάω πράγματα, βρίσκω τι δουλεύει. Το One Prompt Away είναι ο τρόπος μου να μοιράζομαι αυτά που μαθαίνω, στα ελληνικά, χωρίς υπερβολές.",
    p2: "Δεν χρειάζεται να είσαι developer για να βγάλεις αποτέλεσμα από το ChatGPT, το Claude ή οποιοδήποτε AI tool. Χρειάζεσαι τον σωστό τρόπο να ρωτάς. Αυτό ακριβώς διδάσκει κάθε άρθρο εδώ.",
    p3: "Κάθε post έχει κάτι που μπορείς να χρησιμοποιήσεις σήμερα — prompt, workflow, ή ιδέα. Όχι θεωρία για το μέλλον του AI.",
    pillarsTitle: "Τι θα βρεις εδώ",
    contactTitle: "Βρες με εδώ",
    contactText:
      "Δημοσιεύω νέο content κάθε εβδομάδα. Follow για να μην χάνεις τίποτα.",
    articlesLink: "Άρθρα",
  },
  pillars: {
    "prompt-lab": {
      shortDescription: "Πρόβλημα → prompt λύση. Πρακτικό, copy-paste ready.",
      longDescription:
        "Πραγματικά προβλήματα, πραγματικές λύσεις. Κάθε άρθρο έχει prompt που μπορείς να κάνεις copy-paste αμέσως.",
    },
    "tool-drop": {
      shortDescription: "AI tool reviews. Quick, opinionated, hands-on.",
      longDescription:
        "Δοκιμάζω AI tools και σου λέω αν αξίζει ο χρόνος σου. Χωρίς hype, χωρίς affiliate links.",
    },
    "behind-the-prompt": {
      shortDescription: "Deep dives σε prompting techniques και mental models.",
      longDescription:
        "Πώς δουλεύει το prompting στ' αλήθεια. Mental models και τεχνικές που κάνουν τη διαφορά.",
    },
  },
  categories: {
    "prompt-lab": "Prompt Lab",
    "tool-drop": "Tool Drop",
    "behind-the-prompt": "Behind the Prompt",
  },
  meta: {
    title: "One Prompt Away — Ένα prompt σε χωρίζει",
    description:
      "Ανακάλυψε τα AI tools και prompts που θα αλλάξουν τον τρόπο που δουλεύεις. Πρακτικοί οδηγοί στα Ελληνικά.",
    ogTitle: "One Prompt Away — Ένα prompt σε χωρίζει",
    ogDesc:
      "Ανακάλυψε τα AI tools και prompts που θα αλλάξουν τον τρόπο που δουλεύεις.",
    twitterDesc: "AI tools & prompts στα Ελληνικά. Ένα prompt σε χωρίζει.",
    locale: "el_GR",
    dateLocale: "el-GR",
  },
} as const;

const en = {
  nav: {
    articles: "Articles",
    about: "About",
    backHome: "Home",
    backArticles: "All articles",
  },
  home: {
    heroPrefix: "One",
    heroHighlight: "prompt",
    heroSuffix: "away.",
    heroSubtext:
      "Practical guides for AI tools and prompts. Every week, one problem — one AI solution.",
    cta: "Read articles",
    pillarsTitle: "What you'll find here",
    recentTitle: "Latest articles",
    seeAll: "All →",
    readingTime: "read",
    newsletterTitle: "Stay updated",
    newsletterText:
      "One email a week with the best AI prompt or tool. No spam, no hype.",
    newsletterPlaceholder: "your@email.com",
    newsletterButton: "Subscribe",
    terminalRead: "Read how I built it →",
    terminalTopic: '"weekly meal plan"',
    terminalLine1: "Create a weekly meal plan for 2 people,",
    terminalLine2: "Mediterranean diet, budget €50, with a shopping list.",
    terminalCheck1: "Meal plan generated in 28s",
    terminalCheck2: "Shopping list: 23 items, estimated €47.50",
  },
  articles: {
    title: "Articles",
    subtitle:
      "Practical guides for AI tools and prompts. Something new every week.",
    allFilter: "All",
    readingTime: "read",
    empty: "No articles in this category yet.",
    emptyTagline: "One prompt away.",
  },
  article: {
    ctaTitle: "Did you like this?",
    ctaText:
      "Every week I publish new content about AI tools and prompts. Follow on TikTok or subscribe to the newsletter.",
  },
  about: {
    metaTitle: "About",
    metaDesc:
      "What is One Prompt Away, who builds it and why. Practical guides for AI tools and prompts.",
    whoami: "> whoami",
    title: "About",
    intro:
      "A practical blog for people who want to use AI tools the right way — not theoretically, but in practice.",
    p1: "I spend time in AI tools every day — testing, breaking things, finding what works. One Prompt Away is how I share what I learn, without the hype.",
    p2: "You don't need to be a developer to get results from ChatGPT, Claude, or any AI tool. You need the right way to ask. That's exactly what each article here teaches.",
    p3: "Every post has something you can use today — a prompt, workflow, or idea. No theory about the future of AI.",
    pillarsTitle: "What you'll find here",
    contactTitle: "Find me here",
    contactText:
      "I publish new content every week. Follow so you don't miss anything.",
    articlesLink: "Articles",
  },
  pillars: {
    "prompt-lab": {
      shortDescription: "Problem → prompt solution. Practical, copy-paste ready.",
      longDescription:
        "Real problems, real solutions. Every article has a prompt you can copy-paste right away.",
    },
    "tool-drop": {
      shortDescription: "AI tool reviews. Quick, opinionated, hands-on.",
      longDescription:
        "I test AI tools and tell you if they're worth your time. No hype, no affiliate links.",
    },
    "behind-the-prompt": {
      shortDescription: "Deep dives into prompting techniques and mental models.",
      longDescription:
        "How prompting really works. Mental models and techniques that make the difference.",
    },
  },
  categories: {
    "prompt-lab": "Prompt Lab",
    "tool-drop": "Tool Drop",
    "behind-the-prompt": "Behind the Prompt",
  },
  meta: {
    title: "One Prompt Away — One prompt away",
    description:
      "Discover AI tools and prompts that will change the way you work. Practical guides.",
    ogTitle: "One Prompt Away — One prompt away",
    ogDesc: "Discover AI tools and prompts that will change the way you work.",
    twitterDesc: "AI tools & prompts. One prompt away.",
    locale: "en_US",
    dateLocale: "en-US",
  },
} as const;

const translations = { el, en } as const;

export type Translations = typeof el;

export function getTranslations(locale: Locale): Translations {
  return (translations[locale] ?? translations[defaultLocale]) as Translations;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
