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
  "El Sumo Sacerdote": "the_hierophant", // Added for "El Sumo Sacerdote"
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
  const lowerNormalizedSpanishCardName = normalizedSpanishCardName.toLowerCase();

  // Check Major Arcana (case-insensitive key match)
  let majorArcanaMapKey: string | undefined;
  for (const key in majorArcanaSpanishToEnglish) {
    if (key.toLowerCase() === lowerNormalizedSpanishCardName) {
      majorArcanaMapKey = key;
      break;
    }
  }

  if (majorArcanaMapKey) {
    const englishName = majorArcanaSpanishToEnglish[majorArcanaMapKey];
    return {
      path: `/tarot-cards/${englishName}.png`,
      hint: englishName.replace(/_/g, " ").split(" ").slice(0, 2).join(" "),
    };
  }

  // Check Minor Arcana (case-insensitive prefix and suit match)
  for (const rankPrefixSpanish in minorArcanaRanksSpanishToEnglishPrefix) {
    if (lowerNormalizedSpanishCardName.startsWith(rankPrefixSpanish.toLowerCase())) {
      // Extract the suit part using the original rankPrefixSpanish length, then trim and lowercase
      const suitSpanish = normalizedSpanishCardName.substring(rankPrefixSpanish.length).trim();
      const lowerSuitSpanish = suitSpanish.toLowerCase();

      let suitFolderKey: string | undefined;
      for (const key in minorArcanaSuitsSpanishToEnglishFolder) {
        if (key.toLowerCase() === lowerSuitSpanish) {
          suitFolderKey = key;
          break;
        }
      }

      let suitFilePartKey: string | undefined;
      for (const key in minorArcanaSuitsSpanishToEnglishFilePart) {
        if (key.toLowerCase() === lowerSuitSpanish) {
          suitFilePartKey = key;
          break;
        }
      }

      if (suitFolderKey && suitFilePartKey) {
        const rankFilePrefixEnglish = minorArcanaRanksSpanishToEnglishPrefix[rankPrefixSpanish]; // Use original key for value lookup
        const suitFilePartEnglish = minorArcanaSuitsSpanishToEnglishFilePart[suitFilePartKey];
        
        const englishFileName = `${rankFilePrefixEnglish}_${suitFilePartEnglish}`;
        return {
          path: `/tarot-cards/${englishFileName}.png`,
          hint: englishFileName.replace(/_/g, " ").split(" ").slice(0, 2).join(" "),
        };
      }
    }
  }

  // Fallback
  console.warn(`No image mapping found for card: "${normalizedSpanishCardName}" (normalized to: "${lowerNormalizedSpanishCardName}"). Using default image.`);
  return {
    path: '/tarot-cards/default-card.jpg', // Default/fallback card image
    hint: "tarot card", // Generic hint for default
  };
};
