import type { Category, DifficultyConfig } from '../types';

const WORD_BANK: Record<string, string[]> = {
  'tv-shows': [
    'SOPRANOS', 'WITCHER', 'SHERLOCK', 'NARCOS', 'DEXTER', 'HOUSE', 'CROWN', 'SUITS', 'SIMPSONS',
    'BETTER', 'FLASH', 'LUCIFER', 'ATLANTA', 'BONES', 'SQUID', 'GLEE', 'MANDALORIAN', 'SUCCESSION',
    'OUTLANDER', 'EUPHORIA', 'REACHER', 'GOTHAM', 'VIKINGS', 'OZARK', 'CHERNOBYL', 'BEEF', 'ANDOR',
    'SHOGUN', 'FALLOUT', 'FUTURAMA', 'FARGO', 'SCRUBS', 'ARCHER', 'SPYFAMILY', 'POKEMON', 'ONEPIECE',
    'DEADWOOD', 'WIRE', 'LOST', 'FIREFLY', 'INVINCIBLE', 'THEBOYS', 'PEACEMAKER', 'MONARCH',
    'YELLOWSTONE', 'POLDARK', 'FRONTIER', 'GOLIATH', 'BOSCH', 'TREADSTONE', 'HANNA', 'UPLOAD',
    'FOUNDATION', 'SEVERANCE', 'SILO', 'EXPANSE', 'DARK', 'MINDHUNTER', 'LOCKE', 'SANDMAN',
    'TITANS', 'DOOM', 'PATROL', 'SWAMP', 'THING', 'GENV', 'WARRIOR', 'HALO', 'SNOWPIERCER',
    'PERIPHERAL', 'SEE', 'TEHRAN', 'MORNING', 'SHOW', 'TED', 'LASSO', 'HACKS', 'VEEP', 'CURB',
    'YELLOWJACKETS', 'BEAR', 'BABYLON', 'BERLIN', 'COWBOY', 'BEBOP', 'MASH', 'CHEERS', 'WINGS',
    'TAXI', 'FRASIER', 'BREAKING', 'BAD', 'CALL', 'SAUL', 'WALKING', 'DEAD'
  ],
  'sitcoms': [
    'SEINFELD', 'OFFICE', 'PARKS', 'SCRUBS', 'CHEERS', 'FRASIER', 'FRIENDS', 'MASH', 'JOEY',
    'NEWGIRL', 'ATLANTA', 'TEDLASSO', 'SCHITTS', 'VEEP', 'COMMUNITY', 'MALCOLM', 'ARCHER',
    'BROOKLYN', 'SIMPSONS', 'FUTURAMA', 'HIMYM', 'GOLDBERGS', 'REBA', 'LOUIE', 'DAVE',
    'TAXI', 'CURB', 'BOSSY', 'WINGS', 'SPACED', 'PEEP', 'HACKS', 'GIRLS', 'BROAD',
    'SILICON', 'BLACKISH', 'INSECURE', 'ALF', 'FOSHO', 'ROSEANNE', 'WILL', 'GRACE', 'MARTIN',
    'LIVING', 'SINGLE', 'ABBOTT', 'ELEMENTARY', 'GHOSTS', 'COMMUNITY', 'LOUIE', 'KITCHEN', 'CHEF',
    'NIGHT', 'COURT', 'DERRY', 'GIRLS', 'FLEABAG', 'HACKS', 'SCRUBS', 'MALCOLM', 'MIDDLE', 'MODERN',
    'FAMILY', 'GOLDBERGS', 'WONDER', 'YEARS', 'HAPPY', 'DAYS', 'THREE', 'COMPANY', 'PEEP', 'SHOW',
    'GOLDEN', 'GIRLS', 'KING', 'QUEENS', 'RAYMOND', 'FRESH', 'PRINCE', 'BELAIR'
  ],
  'celebrities': [
    'PITT', 'JOLIE', 'CRUISE', 'HANKS', 'ZENDAYA', 'SWIFT', 'BEYONCE', 'GADOT', 'PRATT',
    'LAWRENCE', 'DICAPRIO', 'ROBERTS', 'DENIRO', 'PACINO', 'HATHAWAY', 'MESCAL', 'CHALAMET',
    'PUGH', 'BLUNT', 'GOSLING', 'REYNOLDS', 'STREEP', 'DENZEL', 'BUTLER', 'KEOGHAN',
    'ELBA', 'HARDY', 'THERON', 'COOPER', 'WATSON', 'STALLONE', 'REEVES',
    'BALE', 'JACKMAN', 'HEMSWORTH', 'EVANS', 'DOWNEY', 'JOHANSSON', 'LIVELY', 'PORTMAN',
    'MARGOT', 'ROBBIE', 'STONE', 'VIOLA', 'DAVIS', 'PEDRO', 'PASCAL',
    'JENNA', 'ORTEGA', 'HOLLAND', 'BILLY', 'PORTER', 'LUPITA', 'NYONGO', 'RAE',
    'GILLIAN', 'ANDERSON', 'COLEMAN', 'KIDMAN', 'GOSLING', 'NATALIE', 'PORTMAN', 'THOMAS',
    'HARDY', 'CAVILL', 'MBAPPE', 'MESSI', 'RONALDO', 'LEBRON', 'SERENA', 'TIGER', 'JORDAN',
    'HAWK', 'BOLT', 'SIMONE', 'BILES', 'NADAL', 'FEDERER', 'DJOKOVIC', 'HAMILTON', 'VERSTAPPEN'
  ],
  'history': [
    'ROMANS', 'GREECE', 'EGYPT', 'MAYANS', 'VIKINGS', 'AZTECS', 'NAPOLEON', 'CAESAR', 'LINCOLN',
    'MAGNA', 'CHARTA', 'RENAISSANCE', 'COLUMBUS', 'CRUSADES', 'BYZANTINE', 'OTTOMAN', 'SAMURAI',
    'COLOSSEUM', 'PHARAOH', 'PYRAMIDS', 'BASTILLE', 'VALHALLA', 'SPARTA', 'POMPEII',
    'TEMPLARS', 'NINJA', 'KNIGHT', 'EMPIRE', 'DYNASTY', 'GENGHIS', 'KHAN', 'VICTORIA', 'TUDORS',
    'CHURCHILL', 'STALIN', 'KENNEDY', 'MANDELA', 'GANDHI', 'LUTHER', 'NEWTON', 'DA_VINCI',
    'SUMERIA', 'MESOPOTAMIA', 'INCA', 'CHOLULA', 'PETRA', 'ANGKOR', 'WAT', 'MACHU', 'PICCHU',
    'COLDWAR', 'STAMP', 'ACT', 'VIETNAM', 'WATERLOO', 'PEARL', 'HARBOR', 'HIROSHIMA', 'GETTYSBURG'
  ],
  'science': [
    'ATOM', 'DNA', 'CELL', 'GENE', 'PLANET', 'ORBIT', 'ENERGY', 'FORCE', 'LASER', 'VIRUS',
    'ROBOT', 'PHYSICS', 'OXYGEN', 'QUARK', 'PROTON', 'ELECTRON', 'NEUTRON', 'GALAXY', 'NEBULA',
    'SYNAPSE', 'GRAVITY', 'ISOTOPE', 'KINETIC', 'FUSION', 'FISSION', 'QUARTZ', 'HELIUM',
    'ENTROPY', 'PHOTON', 'PLASMA', 'VECTOR', 'MATRIX', 'BIOLOGY', 'CHEMISTRY',
    'GEOLOGY', 'TECTONIC', 'MAGMA', 'CRYSTAL', 'COMET', 'METEOR', 'QUASAR', 'PULSAR',
    'CHROMOSOME', 'RIBOSOME', 'ENZYME', 'POLYMER', 'EVOLUTION', 'SPECIES', 'REACTION',
    'VOLTAGE', 'CURRENT', 'AMPERE', 'WATT', 'HERTZ', 'DECAY', 'RADIATION', 'SPECTRA', 'LENS',
    'GENOME', 'PROTEIN', 'MITOSIS', 'MEIOSIS', 'NUCLEUS', 'COSMOS', 'SPACE', 'TIME', 'WAVE'
  ],
  'tech': [
    'REACT', 'PYTHON', 'DOCKER', 'GITHUB', 'CLOUD', 'KERNEL', 'MODEM', 'PIXEL', 'LINUX',
    'APPLE', 'INTEL', 'ARRAY', 'BINARY', 'SERVER', 'FRONTEND', 'BACKEND', 'DATABASE', 'ROUTER',
    'CHIPSET', 'SATELLITE', 'ANDROID', 'VIRTUAL', 'QUANTUM', 'NETWORK', 'PYTORCH', 'DOCKER',
    'KUBERNETES', 'TYPESCRIPT', 'NODEJS', 'GOLANG', 'CIPHER', 'BLOCKCHAIN', 'MINING', 'CACHE',
    'FIREWALL', 'BROWSER', 'WIFI', 'STREAM', 'VR_GEAR', 'GPU_CHIP', 'RAM_STICK', 'SSD_DRIVE',
    'COMPILER', 'LINKER', 'PROCESS', 'THREAD', 'MUTEX', 'POINTER', 'HEADER', 'IMPORT',
    'SCRATCH', 'JAVA', 'KOTLIN', 'SWIFT', 'FLUTTER', 'AWS', 'AZURE', 'DEPLOY', 'AUTOMATION'
  ],
  'food': [
    'PIZZA', 'SUSHI', 'BURGER', 'PASTA', 'TACO', 'SALAD', 'STEAK', 'RAMEN', 'CURRY', 'DONUT',
    'BREAD', 'APPLE', 'CHERRY', 'BANANA', 'LASAGNA', 'BURRITO', 'GNOCCHI', 'FALAFEL', 'HUMMUS',
    'WAFFLE', 'PANCAKE', 'PAELLA', 'RISOTTO', 'TRUFFLE', 'GELATO', 'QUICHE', 'NACHOS',
    'CHICKEN', 'TURKEY', 'SASHIMI', 'DIMSUM', 'KEBAB', 'SORBET', 'BAKED', 'GRILLED', 'FRIED',
    'CAKE', 'MUFFIN', 'COOKIES', 'BROWNY', 'STEW', 'SOUP', 'TOAST', 'CEREAL', 'YOGURT',
    'CHURRO', 'BAGEL', 'CROISSANT', 'DANISH', 'POUTINE', 'CEVICHE', 'KIMCHI', 'BULGOGI', 'BIBIMBAP'
  ]
};

/**
 * Fetches themed word lists locally using the internal word bank.
 * The AI generation logic has been removed to satisfy local-only requirements.
 */
export async function fetchWordList(category: Category, config: DifficultyConfig): Promise<string[][]> {
  const wordsPerQuest = Math.floor(config.wordCount / 3);

  // 1. Get words from the bank for the specific category
  const fullList = WORD_BANK[category.id] || WORD_BANK['science'];

  // 2. Filter by length requirements
  const filtered = fullList.filter(w =>
      w.length >= config.minWordLength &&
      w.length <= config.maxWordLength
  );

  // 3. Shuffle the filtered list using Fisher-Yates
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 4. Chunk into 3 arrays (one for each of the 3 quests)
  // Ensure we have enough words, otherwise cycle/reuse
  const result: string[][] = [[], [], []];

  for (let questIdx = 0; questIdx < 3; questIdx++) {
    const start = questIdx * wordsPerQuest;
    const end = start + wordsPerQuest;

    // If we run out of shuffled words, we wrap around or take what we can
    let segment = shuffled.slice(start, end);

    // Fallback: if segment is empty or too small, fill it up from the beginning of the shuffled list
    if (segment.length < wordsPerQuest && shuffled.length > 0) {
      const needed = wordsPerQuest - segment.length;
      segment = [...segment, ...shuffled.slice(0, needed)];
    }

    result[questIdx] = segment.map(w => w.toUpperCase());
  }

  // Simulate a tiny delay for that "generating" feel, then return
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 300);
  });
}