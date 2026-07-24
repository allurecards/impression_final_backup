import type { Verse, VerseTradition } from "@/types/card-design";

/**
 * The original file only offered Bible verses, which quietly assumed every
 * couple is Christian. Verses are now grouped by tradition; the extras panel
 * lets people filter to their own (or browse all, or skip verses entirely
 * and write a custom line).
 */
export const VERSES: Verse[] = [
  // Christian
  {
    id: "c1",
    tradition: "christian",
    ref: "1 Corinthians 13:4",
    text: "Love is patient, love is kind.",
  },
  {
    id: "c2",
    tradition: "christian",
    ref: "Ecclesiastes 4:12",
    text: "A cord of three strands is not quickly broken.",
  },
  { id: "c3", tradition: "christian", ref: "Genesis 2:24", text: "And the two shall become one." },
  {
    id: "c4",
    tradition: "christian",
    ref: "Mark 10:9",
    text: "What God has joined together, let no one separate.",
  },
  {
    id: "c5",
    tradition: "christian",
    ref: "1 John 4:19",
    text: "We love because He first loved us.",
  },

  // Hindu
  {
    id: "h1",
    tradition: "hindu",
    ref: "Rig Veda 10.85.42",
    text: "May our hearts be in harmony, our minds as one.",
  },
  {
    id: "h2",
    tradition: "hindu",
    ref: "Vivaha Samskara blessing",
    text: "May you walk together through all seven steps of life.",
  },

  // Muslim
  {
    id: "m1",
    tradition: "muslim",
    ref: "Qur'an 30:21",
    text: "He created for you mates that you may find tranquility in them.",
  },
  {
    id: "m2",
    tradition: "muslim",
    ref: "Qur'an 25:74",
    text: "Grant us joy in our spouses and offspring.",
  },

  // Jewish
  {
    id: "j1",
    tradition: "jewish",
    ref: "Song of Songs 6:3",
    text: "I am my beloved's, and my beloved is mine.",
  },
  { id: "j2", tradition: "jewish", ref: "Ruth 1:16", text: "Where you go, I will go." },

  // Sikh
  {
    id: "s1",
    tradition: "sikh",
    ref: "Guru Granth Sahib",
    text: "They are not husband and wife who merely sit together; they alone are called husband and wife who have one soul in two bodies.",
  },

  // Secular
  { id: "e1", tradition: "secular", ref: "", text: "Together is a beautiful place to be." },
  { id: "e2", tradition: "secular", ref: "", text: "Two souls, one story, forever begins today." },
  {
    id: "e3",
    tradition: "secular",
    ref: "",
    text: "Whatever our souls are made of, his and mine are the same.",
  },
];

export function versesByTradition(tradition: VerseTradition | "all") {
  return tradition === "all" ? VERSES : VERSES.filter((v) => v.tradition === tradition);
}

export const TRADITION_LABELS: Record<VerseTradition | "all", string> = {
  all: "All traditions",
  christian: "Christian",
  hindu: "Hindu",
  muslim: "Muslim",
  jewish: "Jewish",
  sikh: "Sikh",
  secular: "Secular",
};
