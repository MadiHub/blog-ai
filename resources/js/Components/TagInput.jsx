// resources/js/Components/TagInput.jsx

import React, { useRef, useMemo, useCallback } from 'react'; // Tambahkan useMemo dan useCallback
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/dist/tagify.css';

// Bungkus komponen dengan React.memo
function TagInput({ value = [], onChange, suggestions = [], disabled = false }) {
  const tagifyRef = useRef();

  // Gunakan useMemo untuk settings agar referensinya stabil
  const settings = useMemo(() => ({
    whitelist: suggestions,
    enforceWhitelist: false,
    dropdown: {
      enabled: 0,
      maxItems: 10,
    },
  }), [suggestions]); // settings akan dibuat ulang hanya jika 'suggestions' berubah

  // Bungkus fungsi onChange internal TagInput dengan useCallback
  // Ini untuk memastikan referensi fungsi yang diteruskan ke komponen Tags dari tagify tetap stabil
  const handleTagifyChange = useCallback(e => {
    // Pastikan e.detail.value valid sebelum di-parse
    const val = JSON.parse(e.detail.value || '[]');
    onChange(val.map(item => item.value));
  }, [onChange]); // Fungsi ini akan dibuat ulang hanya jika 'onChange' prop dari parent berubah

  return (
    <Tags
      tagifyRef={tagifyRef}
      settings={settings}
      value={value}
      className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
      onChange={handleTagifyChange} // Gunakan fungsi yang sudah di-memoize
      readOnly={disabled}
    />
  );
}

export default React.memo(TagInput);