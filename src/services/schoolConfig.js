export const SCHOOL_MAPPING = {
  "exscl-01": "LFG Digi High School",
  "exscl-02": "Sreyas the School",
  "exscl-03": "Vashistha Model school, bollaram",
  "exscl-04": "Jeevan Jyothi School",
  "exscl-05": "Sangamithra School, Dammaiguda",
  "exscl-06": "Sri Vaagdevi School (main branch)",
  "exscl-07": "Glorious School",
  "exscl-08": "Sree Gouthami High School",
  "exscl-09": "KVR High School",
  "exscl-10": "Vashistha School, chitkul",
  "exscl-11": "vashistha School,Rampally",
  "exscl-12": "Geethanjali,Isnapur",
  "exscl-13": "Sri Vaagdevi School -2",
  "exscl-14": "Vashistha School,Indresham",
  "exscl-15": "Vashistha School",
  "exscl-16": "Excellence School 16",
  "exscl-17": "Excellence School 17",
  "exscl-18": "Excellence School 18",
};

export const SCHOOL_TEACHER_PASSWORDS = {
  "exscl-01": "exllfg01",
  "exscl-02": "exlsry02",
  "exscl-03": "exlvas03",
  "exscl-04": "exljjv04",
  "exscl-05": "exlsng05",
  "exscl-06": "exlvag06",
  "exscl-07": "exlglo07",
  "exscl-08": "exlgou08",
  "exscl-09": "exlkvr09",
  "exscl-10": "exlvas10",
  "exscl-11": "exlvas11",
  "exscl-12": "exlgee12",
  "exscl-13": "exlvag13",
  "exscl-14": "exlvas14",
  "exscl-15": "exlvas15",
  "exscl-16": "exlsch16",
  "exscl-17": "exlsch17",
  "exscl-18": "exlsch18",
};

export const SCHOOL_PRINCIPAL_PASSWORDS = {
  "exscl-01": "prllfg01",
  "exscl-02": "prlsry02",
  "exscl-03": "prlvas03",
  "exscl-04": "prljjv04",
  "exscl-05": "prlsng05",
  "exscl-06": "prlvag06",
  "exscl-07": "prlglo07",
  "exscl-08": "prlgou08",
  "exscl-09": "prlkvr09",
  "exscl-10": "prlvas10",
  "exscl-11": "prlvas11",
  "exscl-12": "prlgee12",
  "exscl-13": "prlvag13",
  "exscl-14": "prlvas14",
  "exscl-15": "prlvas15",
  "exscl-16": "prlsch16",
  "exscl-17": "prlsch17",
  "exscl-18": "prlsch18",
};

/**
 * Normalizes school code input from exscl-XX or exlschXX formats
 * into standard exscl-XX keys.
 */
export const normalizeSchoolCode = (code) => {
  if (!code) return "";
  const cleaned = code.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  
  // Clean 'exlsch01' to 'exscl-01'
  if (cleaned.startsWith("exlsch")) {
    const num = cleaned.replace("exlsch", "");
    return `exscl-${num}`;
  }
  // Clean 'exscl01' to 'exscl-01'
  if (cleaned.startsWith("exscl")) {
    const num = cleaned.replace("exscl", "");
    return `exscl-${num}`;
  }
  return code;
};

export const getSchoolName = (code) => {
  const normalized = normalizeSchoolCode(code);
  return SCHOOL_MAPPING[normalized] || code;
};
