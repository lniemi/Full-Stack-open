import { useState, useEffect } from "react";
import axios from "axios";
import Countries from "./components/Countries";

const CountryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setAllCountries(response.data);
    });
  }, []);

  const handleSearch = (event) => {
    const search = event.target.value;
    setSearchTerm(search);
    setFilteredCountries(
      allCountries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return (
    <div>
      <div>
        find countries <input value={searchTerm} onChange={handleSearch} />
      </div>
      <Countries countriesToShow={filteredCountries} />
    </div>
  );
};

export default CountryList;
