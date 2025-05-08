// src/lib/tarot-card-mapper.ts

const majorArcanaSpanishToEnglish: Record<string, string> = {
  "El Loco": "the_fool",
  "El Mago": "the_magician",
  "La Sacerdotisa": "the_high_priestess",
  "La Papisa": "the_high_priestess", // Alias for High Priestess
  "La Emperatriz": "the_empress",
  "El Emperador": "the_emperor",
  "El Hierofante": "the_hierophant",
  "El Papa": "the_hierophant", // Alias for Hierophant
  "Los Enamorados": "the_lovers",
  "El Carro": "the_chariot",
  "La Fuerza": "strength",
  "El Ermitaño": "the_hermit",
  "La Rueda de la Fortuna": "wheel_of_fortune",
  "La Justicia": "justice",
  "El Colgado": "the_hanged_man",
  "La Muerte": "death",
  "La Templanza": "temperance",
  "El Diablo": "the_devil",
  "La Torre": "the_tower",
  "La Estrella": "the_star",
  "La Luna": "the_moon",
  "El Sol": "the_sun",
  "El Juicio": "judgement",
  "El Mundo": "the_world",
};

const minorArcanaSuitsSpanishToEnglishFolder: Record<string, string> = {
  "Bastos": "wands",
  "Copas": "cups",
  "Espadas": "swords",
  "Oros": "pentacles",
  "Pentáculos": "pentacles", // Alias for Pentacles
};

// Maps Spanish rank prefix (e.g., "As de") to English filename prefix (e.g., "ace_of")
const minorArcanaRanksSpanishToEnglishPrefix: Record<string, string> = {
  "As de": "ace_of",
  "Dos de": "two_of",
  "Tres de": "three_of",
  "Cuatro de": "four_of",
  "Cinco de": "five_of",
  "Seis de": "six_of",
  "Siete de": "seven_of",
  "Ocho de": "eight_of",
  "Nueve de": "nine_of",
  "Diez de": "ten_of",
  "Sota de": "page_of",
  "Caballero de": "knight_of", // Common Spanish for Knight
  "Caballo de": "knight_of",   // Another common Spanish for Knight
  "Reina de": "queen_of",
  "Rey de": "king_of",
};

// Maps Spanish suit name (e.g., "Bastos") to English suit part for filename (e.g., "wands")
const minorArcanaSuitsSpanishToEnglishFilePart: Record<string, string> = {
  "Bastos": "wands",
  "Copas": "cups",
  "Espadas": "swords",
  "Oros": "pentacles",
  "Pentáculos": "pentacles",
};

export const getTarotCardImagePathAndAiHint = (
  spanishCardName: string
): { path: string; hint: string } => {
  const normalizedSpanishCardName = spanishCardName.trim();

  // Check Major Arcana
  const majorArcanaEnglishName = majorArcanaSpanishToEnglish[normalizedSpanishCardName];
  if (majorArcanaEnglishName) {
    return {
      path: `/tarot-cards/major_arcana/${majorArcanaEnglishName}.png`,
      hint: majorArcanaEnglishName.replace(/_/g, " ").split(" ").slice(0, 2).join(" "),
    };
  }

  // Check Minor Arcana
  for (const rankPrefixSpanish in minorArcanaRanksSpanishToEnglishPrefix) {
    if (normalizedSpanishCardName.startsWith(rankPrefixSpanish)) {
      const suitSpanish = normalizedSpanishCardName.substring(rankPrefixSpanish.length).trim();
      
      const rankFilePrefixEnglish = minorArcanaRanksSpanishToEnglishPrefix[rankPrefixSpanish];
      const suitFolderEnglish = minorArcanaSuitsSpanishToEnglishFolder[suitSpanish];
      const suitFilePartEnglish = minorArcanaSuitsSpanishToEnglishFilePart[suitSpanish];

      if (suitFolderEnglish && rankFilePrefixEnglish && suitFilePartEnglish) {
        // Filename is typically like "ace_of_wands.png"
        const englishFileName = `${rankFilePrefixEnglish}_${suitFilePartEnglish}`;
        return {
          path: `/tarot-cards/minor_arcana/${suitFolderEnglish}/${englishFileName}.png`,
          hint: englishFileName.replace(/_/g, " ").split(" ").slice(0, 2).join(" "),
        };
      }
    }
  }

  // Fallback to a default image if no mapping is found
  console.warn(`No image mapping found for card: "${normalizedSpanishCardName}". Using default image.`);
  return {
    path: '/tarot-cards/default-card.jpg', // Default/fallback card image
    hint: "tarot card", // Generic hint for default
  };
};
