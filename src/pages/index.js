import { useState } from "react";
import CountriesTable from "../components/CountriesTable/CountriesTable";
import Layout from "../components/Layout/Layout";
import SearchInput from "../components/SearchInput/SearchInput";
import styles from "../styles/Home.module.css";

export default function Home({ countries }) {
  const [keyword, setKeyword] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(keyword) ||
      country.region.toLowerCase().includes(keyword) ||
      country.subregion.toLowerCase().includes(keyword) ||
      country.altSpellings
        .map((altSpelling) => altSpelling.toLowerCase())
        .includes(keyword)
  );

  const onInputChange = (e) => {
    e.preventDefault();

    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <Layout>
      <div className={styles.inputContainer}>
        <div className={styles.counts}>
          Found {filteredCountries.length}{" "}
          {filteredCountries.length === 1 ? "country" : "countries"}.
        </div>
        <div className={styles.input}>
          <SearchInput
            placeholder="Filter by Name, Region or Subregion"
            onChange={onInputChange}
          />
        </div>
      </div>
      <CountriesTable countries={filteredCountries} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const res = await fetch("https://restcountries.eu/rest/v2/all");

  const countries = await res.json();

  return {
    props: {
      countries,
    },
  };
};
