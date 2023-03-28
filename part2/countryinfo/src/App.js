import { useState, useEffect } from "react";
import axios from "axios";
import Countries from "./components/Countries";
import CountryData from "./components/CountryData";

const CountryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
    setSelectedCountry(null);
  };

  const handleCountrySelect = (countryName) => {
    const country = filteredCountries.find(
      (c) => c.name.common === countryName
    );
    setSelectedCountry(country);
  };

  return (
    <div>
      <div>
        find countries <input value={searchTerm} onChange={handleSearch} />
      </div>
      {selectedCountry ? (
        <CountryData country={selectedCountry} />
      ) : (
        <Countries
          countriesToShow={filteredCountries}
          handleCountrySelect={handleCountrySelect}
        />
      )}
    </div>
  );
};

export default CountryList;
