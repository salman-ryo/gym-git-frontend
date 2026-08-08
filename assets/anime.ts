export const animeImages = {
    aqua: "/images/anime/aqua.webp",
    deku: "/images/anime/deku.webp",
    asta: "/images/anime/asta.webp",
    levi: "/images/anime/levi.webp",
    gojo: "/images/anime/gojo.webp",
    goku: "/images/anime/goku.webp",
    luffy: "/images/anime/luffy.webp",
    muminrider: "/images/anime/muminrider.webp",
    naruto: "/images/anime/naruto.webp",
    tanjiro: "/images/anime/tanjiro.webp",
    zoro: "/images/anime/zoro.webp",
} as const;

export const animeQuestionImages = {
    zoroq: "/images/anime/question/zoroq.png",
    zoro: "/images/anime/question/zoroq.png",
    // Can be easily extended as more character images are added to /images/anime/question/
} as const;

export type AnimePower = {
    id: string;
    name: string;
    image: string;

    /**
     * A fun, unique flavor text or quote describing the character.
     */
    description: string;

    /**
     * Minimum Gym Power Score required to unlock this character.
     * The upper limit is implicitly the next character's minPower - 1.
     */
    minPower: number;
};

export const animePowerLevels: AnimePower[] = [
    {
        id: "aqua",
        name: "Aqua",
        image: animeImages.aqua,
        description: "Despite Kazuma calling her useless, she's a literal goddess of water whose primary skills include holy magic, crying and accumulating massive debt.",
        minPower: 0,
    },
    {
        id: "muminrider",
        name: "Mumen Rider",
        image: animeImages.muminrider,
        description: "He doesn't have an S-Class body, but he has an S-Class heart. The hero who always arrives to save the day on his trusty bicycle: Justice Crash!",
        minPower: 15,
    },
    {
        id: "tanjiro",
        name: "Tanjiro",
        image: animeImages.tanjiro,
        description: "The only demon slayer who will politely empathize with your tragic backstory right before he cleanly decapitates you.",
        minPower: 25,
    },
    {
        id: "asta",
        name: "Asta",
        image: animeImages.asta,
        description: "Zero magic, 100% muscle, and vocal cords that can shatter glass. He’s going to be the Wizard King purely through the power of never giving up (and yelling).",
        minPower: 35,
    },
    {
        id: "deku",
        name: "Deku",
        image: animeImages.deku,
        description: "Started with no quirk and a lot of tears. Now he just shatters his own bones at Mach speeds to make sure everyone is smiling.",
        minPower: 45,
    },
    {
        id: "levi",
        name: "Levi",
        image: animeImages.levi,
        description: "Humanity's strongest soldier. He will slice through a dozen Titans like a deadly Beyblade, but only if the battlefield meets his strict sanitation standards.",
        minPower: 55,
    },
    {
        id: "zoro",
        name: "Roronoa Zoro",
        image: animeImages.zoro,
        minPower: 65,
        description:
            "Most people stop when they're tired. Zoro keeps training because his dream demands nothing less than becoming the world's greatest swordsman.",
    },
    {
        id: "gojo",
        name: "Gojo",
        image: animeImages.gojo,
        description: "Throughout heaven and earth, he alone is the honored one. Also, he's definitely going to be late to this battle because he was buying sweet treats.",
        minPower: 75,
    },
    {
        id: "naruto",
        name: "Naruto",
        image: animeImages.naruto,
        description: "The unpredictable ninja who will beat you within an inch of your life, then use 'Talk no Jutsu' to invite you out for ramen and become your best friend.",
        minPower: 85,
    },
    {
        id: "luffy",
        name: "Luffy",
        image: animeImages.luffy,
        description: "A rubber man with room in his stomach for an entire island’s worth of meat. If you tell him a rule, he's already breaking it.",
        minPower: 90,
    },
    {
        id: "goku",
        name: "Goku",
        image: animeImages.goku,
        description: "“I heard you're pretty strong!” — The last words you hear before he accidentally destroys the local solar system in a friendly sparring match.",
        minPower: 97,
    },
] as const;

/**
 * Question Modal Anime Mascot Roster
 * Used in DailyCheckInModal Step 1 to greet the user.
 * NOTE: Aqua is strictly excluded from the Question section.
 * Characters from the question folder (e.g. zoroq.png) are prioritized.
 */
export type QuestionAnimeMascot = {
    id: string;
    name: string;
    image: string;
    tagline: string;
    questionQuote: string;
    glowColor: string;
    isQuestionFolder?: boolean;
};

export const questionAnimeMascots: QuestionAnimeMascot[] = [
    // Dedicated question folder mascot (Preferred)
    {
        id: "zoroq",
        name: "Zoro",
        image: animeQuestionImages.zoroq,
        tagline: "Three-Sword Discipline",
        questionQuote: "Lost your way to the gym, or did you slice through today's workout?",
        glowColor: "rgba(0, 255, 136, 0.4)",
        isQuestionFolder: true,
    },
    // Other anime heroes (Aqua is excluded here)
    {
        id: "goku",
        name: "Goku",
        image: animeImages.goku,
        tagline: "Hyperbolic Time Chamber",
        questionQuote: "Did you push past your power limits in the gym today?!",
        glowColor: "rgba(245, 158, 11, 0.4)",
    },
    {
        id: "luffy",
        name: "Luffy",
        image: animeImages.luffy,
        tagline: "Gear 5th Unlimited Stamina",
        questionQuote: "Did you train hard today? Time for a giant post-workout feast!",
        glowColor: "rgba(168, 85, 247, 0.4)",
    },
    {
        id: "asta",
        name: "Asta",
        image: animeImages.asta,
        tagline: "Anti-Magic Pure Muscle",
        questionQuote: "Not giving up is my magic! Did you crush your workout today?!",
        glowColor: "rgba(239, 68, 68, 0.4)",
    },
    {
        id: "deku",
        name: "Deku",
        image: animeImages.deku,
        tagline: "Plus Ultra Commitment",
        questionQuote: "Did you go Plus Ultra today? Keep that commit streak alive!",
        glowColor: "rgba(16, 185, 129, 0.4)",
    },
    {
        id: "gojo",
        name: "Gojo",
        image: animeImages.gojo,
        tagline: "Limitless Power",
        questionQuote: "Throughout heaven and earth, did you honor your workout today?",
        glowColor: "rgba(56, 189, 248, 0.4)",
    },
    {
        id: "levi",
        name: "Levi",
        image: animeImages.levi,
        tagline: "Humanity's Strongest",
        questionQuote: "Make a choice with no regrets. Did you give your session everything today?",
        glowColor: "rgba(20, 184, 166, 0.4)",
    },
    {
        id: "naruto",
        name: "Naruto",
        image: animeImages.naruto,
        tagline: "Sage Mode Discipline",
        questionQuote: "Believe it! Did you train like a future Hokage today?",
        glowColor: "rgba(249, 115, 22, 0.4)",
    },
    {
        id: "tanjiro",
        name: "Tanjiro",
        image: animeImages.tanjiro,
        tagline: "Total Concentration",
        questionQuote: "Total Concentration Breathing! Did you complete your workout today?",
        glowColor: "rgba(236, 72, 153, 0.4)",
    },
    {
        id: "muminrider",
        name: "Mumen Rider",
        image: animeImages.muminrider,
        tagline: "Justice Heart",
        questionQuote: "Justice Crash! Did you pedal your way through today's workout?",
        glowColor: "rgba(34, 211, 238, 0.4)",
    },
];

/**
 * Weighted random selector giving preference to images in the question folder
 */
export function getWeightedQuestionMascot(): QuestionAnimeMascot {
    const questionFolderMascots = questionAnimeMascots.filter((m) => m.isQuestionFolder);
    const otherMascots = questionAnimeMascots.filter((m) => !m.isQuestionFolder && m.id !== "aqua");

    // 50% chance to pick from question folder if available, 50% for other heroes
    if (questionFolderMascots.length > 0 && Math.random() < 0.5) {
        const randIdx = Math.floor(Math.random() * questionFolderMascots.length);
        return questionFolderMascots[randIdx];
    }

    const pool = otherMascots.length > 0 ? otherMascots : questionAnimeMascots;
    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
}

/**
 * Cutscene Hero Rosters for DailyCheckInModal
 */
export type AnimeCutsceneHero = {
    character: string;
    image: string;
    sfxJa: string;
    sfxEn: string;
    title: string;
    subtitle: string;
    badge1: string;
    badge2: string;
    badge3: string;
    accentColor: string;
    glowColor: string;
};

export const yesAnimeRoster: AnimeCutsceneHero[] = [
    {
        character: "Zoro",
        image: animeImages.zoro,
        sfxJa: "ドォォン!!",
        sfxEn: "ASHURA STRIKE!",
        title: "THREE-SWORD STYLE: GAINZ UNLOCKED!",
        subtitle: "Streak defended! The path of discipline continues.",
        badge1: "⚔️ +1000 GYM EXP",
        badge2: "🔥 STREAK BOOST ACTIVE",
        badge3: "⚡ DISCIPLINE: 100%",
        accentColor: "from-emerald-400 via-neon-green to-teal-300",
        glowColor: "rgba(0, 255, 136, 0.55)",
    },
    {
        character: "Goku",
        image: animeImages.goku,
        sfxJa: "カメハメ波!!",
        sfxEn: "SUPER SAIYAN!",
        title: "POWER LEVEL OVER 9000!",
        subtitle: "Pushing past your physical limits like a true warrior!",
        badge1: "⚡ POWER LEVEL: OVER 9000",
        badge2: "💥 ULTRA INSTINCT READY",
        badge3: "👑 HYPERBOLIC GAINS",
        accentColor: "from-amber-400 via-orange-500 to-yellow-300",
        glowColor: "rgba(245, 158, 11, 0.55)",
    },
    {
        character: "Luffy",
        image: animeImages.luffy,
        sfxJa: "ギア5!!",
        sfxEn: "GEAR FIFTH!",
        title: "WARRIOR OF LIBERATION: MAX STAMINA!",
        subtitle: "Nothing can stop the rhythm of your iron journey!",
        badge1: "🍖 UNLIMITED STAMINA",
        badge2: "⚡ KING OF THE GYM",
        badge3: "✨ MAXIMUM HYPE",
        accentColor: "from-purple-400 via-pink-500 to-neon-cyan",
        glowColor: "rgba(168, 85, 247, 0.55)",
    },
    {
        character: "Asta",
        image: animeImages.asta,
        sfxJa: "オラァァ!!",
        sfxEn: "NEVER GIVING UP!",
        title: "ZERO MAGIC, 100% RAW IRON!",
        subtitle: "Overcoming impossible odds with pure grit and muscle!",
        badge1: "🗡️ DEMON SLAYER STRENGTH",
        badge2: "🔥 LIMIT BROKEN",
        badge3: "💪 1000% EFFORT",
        accentColor: "from-red-500 via-orange-500 to-amber-400",
        glowColor: "rgba(239, 68, 68, 0.55)",
    },
    {
        character: "Deku",
        image: animeImages.deku,
        sfxJa: "スマッシュ!!",
        sfxEn: "PLUS ULTRA SMASH!",
        title: "ONE FOR ALL: 100% UNLEASHED!",
        subtitle: "Every rep brings you closer to being the world's greatest!",
        badge1: "💥 DETROIT SMASH",
        badge2: "⚡ FULL COWL 100%",
        badge3: "🌟 HERO DISCIPLINE",
        accentColor: "from-emerald-400 via-teal-400 to-cyan-300",
        glowColor: "rgba(16, 185, 129, 0.55)",
    },
];

// Aqua and all recovery characters can be shown when NO / Rest Day is clicked
export const noAnimeRoster: AnimeCutsceneHero[] = [
    {
        character: "Aqua",
        image: animeImages.aqua,
        sfxJa: "スヤァ...",
        sfxEn: "RECOVERY TIME!",
        title: "DIVINE REST PROTOCOL ACTIVATED!",
        subtitle: "Even water goddesses need downtime to restore their mana.",
        badge1: "💤 HP RECHARGING +100%",
        badge2: "💧 HEALING AURA",
        badge3: "🛡️ REST IS CRITICAL",
        accentColor: "from-sky-400 via-cyan-400 to-blue-500",
        glowColor: "rgba(56, 189, 248, 0.55)",
    },
    {
        character: "Zoro",
        image: animeImages.zoro,
        sfxJa: "ゴゴゴ...",
        sfxEn: "ZEN MEDITATION",
        title: "RECHARGING SWORDSMAN HAKI!",
        subtitle: "Rest is 50% of the gainz. Recover for tomorrow’s battle.",
        badge1: "💤 HAKI REGEN PROTOCOL",
        badge2: "🛡️ MUSCLE REPAIR ACTIVE",
        badge3: "⚔️ RETURN TOMORROW",
        accentColor: "from-emerald-500 via-teal-400 to-indigo-400",
        glowColor: "rgba(20, 184, 166, 0.55)",
    },
    {
        character: "Mumen Rider",
        image: animeImages.muminrider,
        sfxJa: "ジャスティス!!",
        sfxEn: "JUSTICE REST!",
        title: "S-CLASS HEART: RECOVERY BREAK!",
        subtitle: "Taking care of your body so you can ride another day.",
        badge1: "🚲 BIKE MAINTENANCE",
        badge2: "❤️ S-CLASS HEART REGEN",
        badge3: "✨ BACK IN ACTION SOON",
        accentColor: "from-teal-400 via-emerald-400 to-amber-400",
        glowColor: "rgba(16, 185, 129, 0.55)",
    },
    {
        character: "Levi",
        image: animeImages.levi,
        sfxJa: "フッ...",
        sfxEn: "CLEAN RECOVERY",
        title: "REST PROTOCOL: SHARPEN THE BLADES!",
        subtitle: "A disciplined soldier rests when ordered. Clean and tactical.",
        badge1: "🗡️ TACTICAL PAUSE",
        badge2: "☕ BLACK TEA BREAK",
        badge3: "🎯 100% FOCUS TOMORROW",
        accentColor: "from-zinc-400 via-teal-400 to-cyan-400",
        glowColor: "rgba(45, 212, 191, 0.55)",
    },
];