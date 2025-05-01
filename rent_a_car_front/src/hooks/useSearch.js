import { useState } from 'react';

const useSearch = (data) => {
  const [query, setQuery] = useState('');

  const filteredData = data.filter((item) =>
    item.car_name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return {
    query,
    filteredData,
    handleSearchChange,
  };
};

export default useSearch;
