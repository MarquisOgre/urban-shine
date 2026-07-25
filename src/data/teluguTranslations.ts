// Telugu translations for ingredient "particulars" names.
// Lookup is case-insensitive and trimmed. Falls back to the English name.

const teluguMap: Record<string, string> = {
  "acid": "యాసిడ్",
  "sles": "ఎస్ఎల్ఈఎస్",
  "citric acid": "నిమ్మ ఆమ్లం",
  "salt": "ఉప్పు",
  "color": "రంగు",
  "ro water": "ఆర్‌ఓ నీరు",
  "soda ash": "సోడా యాష్",
  "acid slurry": "యాసిడ్ స్లరీ",
  "ss": "సోడియం సల్ఫేట్",
  "sodium sulphate": "సోడియం సల్ఫేట్",
  "jasmine perfume": "మల్లె సువాసన",
  "tsp": "టీఎస్‌పీ",
  "crystals": "స్ఫటికాలు",
  "tinopal": "టినోపాల్",
  "robin blue": "రాబిన్ బ్లూ",
  "aos": "ఏఓఎస్",
  "perfume": "సువాసన",
  "caustic soda": "కాస్టిక్ సోడా",
  "sodium benzoate": "సోడియం బెంజోయేట్",
  "bkc": "బీకేసీ",
  "handwash base - pearl": "హ్యాండ్‌వాష్ బేస్ - పెరల్",
  "glycerin": "గ్లిజరిన్",
  "alphox 200": "అల్ఫాక్స్ 200",
  "phenyl concentrate": "ఫినైల్ కాన్సన్ట్రేట్",
  "rose extract": "గులాబీ సారం",
  "balm pack": "బామ్ ప్యాక్",
  "white petroleum jelly base": "వైట్ పెట్రోలియం జెల్లీ బేస్",
  "acid thickener": "యాసిడ్ థికెనర్",
};

export const getTelugu = (particulars: string): string | null => {
  const key = particulars.trim().toLowerCase();
  return teluguMap[key] ?? null;
};
