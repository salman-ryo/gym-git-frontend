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