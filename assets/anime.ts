export const animeImages = {
    aqua: "/images/anime/aqua.png",
    deku: "/images/anime/deku.png",
    gojo: "/images/anime/gojo.png",
    goku: "/images/anime/goku.png",
    luffy: "/images/anime/luffy.png",
    muminrider: "/images/anime/muminrider.png",
    naruto: "/images/anime/naruto.png",
    tanjiro: "/images/anime/tanjiro.png",
} as const;

export type AnimePower = {
    id: string;
    name: string;
    image: string;
    power: number;
};

export const animePowerLevels: AnimePower[] = [
    {
        id: "aqua",
        name: "Aqua",
        image: animeImages.aqua,
        power: 5,
    },
    {
        id: "muminrider",
        name: "Mumen Rider",
        image: animeImages.muminrider,
        power: 25,
    },
    {
        id: "tanjiro",
        name: "Tanjiro",
        image: animeImages.tanjiro,
        power: 55,
    },
    {
        id: "deku",
        name: "Deku",
        image: animeImages.deku,
        power: 72,
    },
    {
        id: "gojo",
        name: "Gojo",
        image: animeImages.gojo,
        power: 88,
    },
    {
        id: "naruto",
        name: "Naruto",
        image: animeImages.naruto,
        power: 94,
    },
    {
        id: "luffy",
        name: "Luffy",
        image: animeImages.luffy,
        power: 97,
    },
    {
        id: "goku",
        name: "Goku",
        image: animeImages.goku,
        power: 100,
    },
];