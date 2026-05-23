/**
 * Sanitize name data to ensure all fields are valid React-renderable values
 * Converts objects to strings where needed
 */
export function sanitizeNameData(data) {
  if (!data) return data;

  const sanitized = { ...data };

  // Convert non-string primitives to strings
  const stringFields = [
    'lucky_number', 'lucky_day', 'lucky_stone', 'life_path_number',
    'name', 'meaning', 'short_meaning', 'long_meaning', 'origin', 
    'gender', 'religion', 'spiritual_meaning', 'cultural_impact',
    'spiritual_significance'
  ];

  stringFields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'object') {
      sanitized[field] = JSON.stringify(sanitized[field]);
    }
  });

  // Handle arrays of objects
  if (sanitized.lucky_colors && Array.isArray(sanitized.lucky_colors)) {
    sanitized.lucky_colors = sanitized.lucky_colors.map(color =>
      typeof color === 'object' ? JSON.stringify(color) : String(color)
    );
  }

  if (sanitized.celebrity_usage && Array.isArray(sanitized.celebrity_usage)) {
    sanitized.celebrity_usage = sanitized.celebrity_usage.map(person =>
      typeof person === 'object' ? JSON.stringify(person) : String(person)
    );
  }

  // Handle pronunciation object
  if (sanitized.pronunciation && typeof sanitized.pronunciation === 'object') {
    sanitized.pronunciation = {
      english: sanitized.pronunciation.english ? String(sanitized.pronunciation.english) : null,
      ipa: sanitized.pronunciation.ipa ? String(sanitized.pronunciation.ipa) : null
    };
  }

  // Handle nested references in islamic_reference and vedic_reference
  if (sanitized.islamic_reference && typeof sanitized.islamic_reference === 'object') {
    sanitized.islamic_reference = {
      is_quranic: Boolean(sanitized.islamic_reference.is_quranic),
      note: sanitized.islamic_reference.note ? String(sanitized.islamic_reference.note) : null
    };
  }

  if (sanitized.vedic_reference && typeof sanitized.vedic_reference === 'object') {
    sanitized.vedic_reference = {
      is_vedic: Boolean(sanitized.vedic_reference.is_vedic),
      root_origin: sanitized.vedic_reference.root_origin ? String(sanitized.vedic_reference.root_origin) : null,
      note: sanitized.vedic_reference.note ? String(sanitized.vedic_reference.note) : null
    };
  }

  // Handle language translations
  const langKeys = ['in_english', 'in_urdu', 'in_arabic', 'in_hindi', 'in_sanskrit', 
                   'in_pashto', 'in_tamil', 'in_telugu', 'in_marathi', 'in_bengali',
                   'in_punjabi', 'in_turkish', 'in_persian', 'in_malay', 'in_indonesian',
                   'in_french', 'in_spanish', 'in_german', 'in_italian', 'in_chinese',
                   'in_japanese', 'in_korean', 'in_russian'];

  langKeys.forEach(key => {
    if (sanitized[key] && typeof sanitized[key] === 'object') {
      sanitized[key] = {
        name: sanitized[key].name ? String(sanitized[key].name) : '',
        meaning: sanitized[key].meaning ? String(sanitized[key].meaning) : ''
      };
    }
  });

  return sanitized;
}
