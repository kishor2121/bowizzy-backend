const { Country, State, City } = require("country-state-city");

exports.getLocations = (req, res) => {
  const { countryCode, stateCode } = req.query;

  if (!countryCode && !stateCode) {
    return res.json(Country.getAllCountries());
  }

  if (countryCode && !stateCode) {
    return res.json(State.getStatesOfCountry(countryCode));
  }

  if (countryCode && stateCode) {
    return res.json(City.getCitiesOfState(countryCode, stateCode));
  }
};
