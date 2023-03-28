import CountryData from "./CountryData";

const Countries = ({ countriesToShow, handleCountrySelect }) => {
  if (countriesToShow.length === 1) {
    return <CountryData country={countriesToShow[0]} />;
  } else if (countriesToShow.length <= 10) {
    return (
      <div>
        {countriesToShow.map((country) => (
          <div key={country.name.official}>
            {country.name.common}
            <button onClick={() => handleCountrySelect(country.name.common)}>
              Show
            </button>
          </div>
        ))}
      </div>
    );
  } else if (countriesToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }
};

export default Countries;
