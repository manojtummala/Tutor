import { writeFileSync } from "node:fs";

const base = {
  type: "kana",
  level: "kana",
  moduleId: "kana-foundations",
};

const rows = [
  { row: "vowel", lesson: "hiragana-vowels", kana: [["あ", "a"], ["い", "i"], ["う", "u"], ["え", "e"], ["お", "o"]] },
  { row: "k", lesson: "hiragana-k-row", kana: [["か", "ka"], ["き", "ki"], ["く", "ku"], ["け", "ke"], ["こ", "ko"]] },
  { row: "s", lesson: "hiragana-s-row", kana: [["さ", "sa"], ["し", "shi"], ["す", "su"], ["せ", "se"], ["そ", "so"]] },
  { row: "t", lesson: "hiragana-t-row", kana: [["た", "ta"], ["ち", "chi"], ["つ", "tsu"], ["て", "te"], ["と", "to"]] },
  { row: "n", lesson: "hiragana-n-row", kana: [["な", "na"], ["に", "ni"], ["ぬ", "nu"], ["ね", "ne"], ["の", "no"]] },
  { row: "h", lesson: "hiragana-h-row", kana: [["は", "ha"], ["ひ", "hi"], ["ふ", "fu"], ["へ", "he"], ["ほ", "ho"]] },
  { row: "m", lesson: "hiragana-m-row", kana: [["ま", "ma"], ["み", "mi"], ["む", "mu"], ["め", "me"], ["も", "mo"]] },
  { row: "y", lesson: "hiragana-y-row", kana: [["や", "ya"], ["ゆ", "yu"], ["よ", "yo"]] },
  { row: "r", lesson: "hiragana-r-row", kana: [["ら", "ra"], ["り", "ri"], ["る", "ru"], ["れ", "re"], ["ろ", "ro"]] },
  { row: "w", lesson: "hiragana-w-row", kana: [["わ", "wa"], ["を", "wo"]] },
  { row: "n-final", lesson: "hiragana-n-final", kana: [["ん", "n"]] },
];

const katakanaRows = [
  { row: "vowel", lesson: "katakana-vowels", kana: [["ア", "a"], ["イ", "i"], ["ウ", "u"], ["エ", "e"], ["オ", "o"]] },
  { row: "k", lesson: "katakana-k-row", kana: [["カ", "ka"], ["キ", "ki"], ["ク", "ku"], ["ケ", "ke"], ["コ", "ko"]] },
  { row: "s", lesson: "katakana-s-row", kana: [["サ", "sa"], ["シ", "shi"], ["ス", "su"], ["セ", "se"], ["ソ", "so"]] },
  { row: "t", lesson: "katakana-t-row", kana: [["タ", "ta"], ["チ", "chi"], ["ツ", "tsu"], ["テ", "te"], ["ト", "to"]] },
  { row: "n", lesson: "katakana-n-row", kana: [["ナ", "na"], ["ニ", "ni"], ["ヌ", "nu"], ["ネ", "ne"], ["ノ", "no"]] },
  { row: "h", lesson: "katakana-h-row", kana: [["ハ", "ha"], ["ヒ", "hi"], ["フ", "fu"], ["ヘ", "he"], ["ホ", "ho"]] },
  { row: "m", lesson: "katakana-m-row", kana: [["マ", "ma"], ["ミ", "mi"], ["ム", "mu"], ["メ", "me"], ["モ", "mo"]] },
  { row: "y", lesson: "katakana-y-row", kana: [["ヤ", "ya"], ["ユ", "yu"], ["ヨ", "yo"]] },
  { row: "r", lesson: "katakana-r-row", kana: [["ラ", "ra"], ["リ", "ri"], ["ル", "ru"], ["レ", "re"], ["ロ", "ro"]] },
  { row: "w", lesson: "katakana-w-row", kana: [["ワ", "wa"], ["ヲ", "wo"]] },
  { row: "n-final", lesson: "katakana-n-final", kana: [["ン", "n"]] },
];

const hiraganaDakuten = [
  ["が", "ga", "g"], ["ぎ", "gi", "g"], ["ぐ", "gu", "g"], ["げ", "ge", "g"], ["ご", "go", "g"],
  ["ざ", "za", "z"], ["じ", "ji", "z"], ["ず", "zu", "z"], ["ぜ", "ze", "z"], ["ぞ", "zo", "z"],
  ["だ", "da", "d"], ["ぢ", "ji", "d"], ["づ", "zu", "d"], ["で", "de", "d"], ["ど", "do", "d"],
  ["ば", "ba", "b"], ["び", "bi", "b"], ["ぶ", "bu", "b"], ["べ", "be", "b"], ["ぼ", "bo", "b"],
];
const katakanaDakuten = [
  ["ガ", "ga", "g"], ["ギ", "gi", "g"], ["グ", "gu", "g"], ["ゲ", "ge", "g"], ["ゴ", "go", "g"],
  ["ザ", "za", "z"], ["ジ", "ji", "z"], ["ズ", "zu", "z"], ["ゼ", "ze", "z"], ["ゾ", "zo", "z"],
  ["ダ", "da", "d"], ["ヂ", "ji", "d"], ["ヅ", "zu", "d"], ["デ", "de", "d"], ["ド", "do", "d"],
  ["バ", "ba", "b"], ["ビ", "bi", "b"], ["ブ", "bu", "b"], ["ベ", "be", "b"], ["ボ", "bo", "b"],
];
const hiraganaHandakuten = [["ぱ", "pa"], ["ぴ", "pi"], ["ぷ", "pu"], ["ぺ", "pe"], ["ぽ", "po"]];
const katakanaHandakuten = [["パ", "pa"], ["ピ", "pi"], ["プ", "pu"], ["ペ", "pe"], ["ポ", "po"]];
const hiraganaYoon = [
  ["きゃ", "kya"], ["きゅ", "kyu"], ["きょ", "kyo"], ["ぎゃ", "gya"], ["ぎゅ", "gyu"], ["ぎょ", "gyo"],
  ["しゃ", "sha"], ["しゅ", "shu"], ["しょ", "sho"], ["じゃ", "ja"], ["じゅ", "ju"], ["じょ", "jo"],
  ["ちゃ", "cha"], ["ちゅ", "chu"], ["ちょ", "cho"], ["ぢゃ", "ja"], ["ぢゅ", "ju"], ["ぢょ", "jo"],
  ["にゃ", "nya"], ["にゅ", "nyu"], ["にょ", "nyo"], ["ひゃ", "hya"], ["ひゅ", "hyu"], ["ひょ", "hyo"],
  ["びゃ", "bya"], ["びゅ", "byu"], ["びょ", "byo"], ["ぴゃ", "pya"], ["ぴゅ", "pyu"], ["ぴょ", "pyo"],
  ["みゃ", "mya"], ["みゅ", "myu"], ["みょ", "myo"], ["りゃ", "rya"], ["りゅ", "ryu"], ["りょ", "ryo"],
];
const katakanaYoon = [
  ["キャ", "kya"], ["キュ", "kyu"], ["キョ", "kyo"], ["ギャ", "gya"], ["ギュ", "gyu"], ["ギョ", "gyo"],
  ["シャ", "sha"], ["シュ", "shu"], ["ショ", "sho"], ["ジャ", "ja"], ["ジュ", "ju"], ["ジョ", "jo"],
  ["チャ", "cha"], ["チュ", "chu"], ["チョ", "cho"], ["ヂャ", "ja"], ["ヂュ", "ju"], ["ヂョ", "jo"],
  ["ニャ", "nya"], ["ニュ", "nyu"], ["ニョ", "nyo"], ["ヒャ", "hya"], ["ヒュ", "hyu"], ["ヒョ", "hyo"],
  ["ビャ", "bya"], ["ビュ", "byu"], ["ビョ", "byo"], ["ピャ", "pya"], ["ピュ", "pyu"], ["ピョ", "pyo"],
  ["ミャ", "mya"], ["ミュ", "myu"], ["ミョ", "myo"], ["リャ", "rya"], ["リュ", "ryu"], ["リョ", "ryo"],
];

function audioSrc(romaji) {
  return `/audio/kana/${romaji}.mp3`;
}

function id(script, romaji, kana) {
  return `${script}_${romaji}_${kana.codePointAt(0).toString(16)}`.replaceAll("-", "_");
}

function item(script, kana, romaji, lessonId, metadata) {
  return {
    ...base,
    id: id(script, romaji, kana),
    lessonId,
    japanese: kana,
    reading: romaji,
    romaji,
    meaning: `${script} ${metadata.variationType === "basic" ? "character" : "kana"} for ${romaji}`,
    audioSrc: audioSrc(romaji),
    metadata: { script, ...metadata },
  };
}

const hiragana = rows.flatMap((row) =>
  row.kana.map(([kana, romaji]) => item("hiragana", kana, romaji, row.lesson, { row: row.row, variationType: "basic" })),
);
const katakana = katakanaRows.flatMap((row) =>
  row.kana.map(([kana, romaji]) => item("katakana", kana, romaji, row.lesson, { row: row.row, variationType: "basic" })),
);

const variations = [
  ...hiraganaDakuten.map(([kana, romaji, row]) => item("hiragana", kana, romaji, "kana-dakuten", { row, variationType: "dakuten" })),
  ...katakanaDakuten.map(([kana, romaji, row]) => item("katakana", kana, romaji, "kana-dakuten", { row, variationType: "dakuten" })),
  ...hiraganaHandakuten.map(([kana, romaji]) => item("hiragana", kana, romaji, "kana-handakuten", { row: "p", variationType: "handakuten" })),
  ...katakanaHandakuten.map(([kana, romaji]) => item("katakana", kana, romaji, "kana-handakuten", { row: "p", variationType: "handakuten" })),
  ...hiraganaYoon.map(([kana, romaji]) => item("hiragana", kana, romaji, "kana-yoon", { row: "yoon", variationType: "combination" })),
  ...katakanaYoon.map(([kana, romaji]) => item("katakana", kana, romaji, "kana-yoon", { row: "yoon", variationType: "combination" })),
  item("hiragana", "っ", "small-tsu", "kana-small-tsu", { row: "special", variationType: "small-tsu" }),
  item("katakana", "ッ", "small-tsu", "kana-small-tsu", { row: "special", variationType: "small-tsu" }),
  item("katakana", "ー", "long-vowel", "kana-long-vowels", { row: "special", variationType: "long-vowel" }),
  item("hiragana", "あ/お", "a-o", "kana-similar-looking", { row: "drill", variationType: "similar-looking" }),
  item("hiragana", "ぬ/め", "nu-me", "kana-similar-looking", { row: "drill", variationType: "similar-looking" }),
  item("katakana", "シ/ツ", "shi-tsu", "kana-similar-looking", { row: "drill", variationType: "similar-looking" }),
  item("katakana", "ソ/ン", "so-n", "kana-similar-looking", { row: "drill", variationType: "similar-looking" }),
];

writeFileSync("data/kana/hiragana.json", `${JSON.stringify(hiragana, null, 2)}\n`);
writeFileSync("data/kana/katakana.json", `${JSON.stringify(katakana, null, 2)}\n`);
writeFileSync("data/kana/variations.json", `${JSON.stringify(variations, null, 2)}\n`);
console.log(`Wrote ${hiragana.length} hiragana, ${katakana.length} katakana, ${variations.length} variation items.`);
