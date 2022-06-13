import styles from "./Country.module.css";
import Layout from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";

const getCountry = async (id) => {
  const res = await fetch(`https://restcountries.com/rest/v3.1/alpha/${id}`);

  const country = await res.json();
  return country[0];
};

const getCountrySummary = async (name) => {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${name}`,
    { headers: { "User-Agent": "lauro.enzo@gmail.com" } }
  );

  const countrySummary = await res.json();
  return countrySummary;
};

const getCountryImages = async (name) => {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/media-list/${name}`,
    { headers: { "User-Agent": "lauro.enzo@gmail.com" } }
  );

  const countryMedia = await res.json();

  if (countryMedia.items) {
    const countryImages = countryMedia.items.filter(
      (media) => media.type === "image"
    );
    const countryImagesSrc = countryImages.map((image) =>
      image.showInGallery ? image.srcset[0] : image
    );

    return countryImagesSrc;
  } else {
    return [];
  }
};

const Country = ({ country, countrySummary, countryImages }) => {
  const [borders, setBorders] = useState([]);

  const getBorders = async () => {
    const borders = await Promise.all(
      country.borders.map((border) => getCountry(border))
    );

    setBorders(borders);
  };

  useEffect(() => {
    getBorders();
  }, [country]);

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Layout title={country.name}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <div className={styles.overview_panel}>
            <img src={country.flag} alt={country.name}></img>

            <h1 className={styles.overview_name}>{country.name}</h1>
            <div className={styles.overview_region}>{country.region}</div>

            <div className={styles.overview_numbers}>
              <div className={styles.overview_population}>
                <div className={styles.overview_value}>
                  {numberWithCommas(country.population)}
                </div>
                <div className={styles.overview_label}>Population</div>
              </div>

              <div className={styles.overview_area}>
                <div className={styles.overview_value}>
                  {country.area !== null ? numberWithCommas(country.area) : 0}
                </div>
                <div className={styles.overview_label}>
                  Area (km<sup style={{ fontSize: "0.75rem" }}>2</sup>)
                </div>
              </div>
            </div>
            <div className={styles.overview_summary}>
              {countrySummary.extract}
            </div>
          </div>
        </div>
        <div className={styles.container_right}>
          <div className={styles.details_panel}>
            <h4 className={styles.details_panel_heading}>Details</h4>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Capital</div>
              <div className={styles.details_panel_value}>
                {country.capital}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Subregion</div>
              <div className={styles.details_panel_value}>
                {country.subregion}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Languages</div>
              <div className={styles.details_panel_value}>
                {country.languages
                  .map(({ name, nativeName }) => `${name}(${nativeName})`)
                  .join(", ")}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currencies</div>
              <div className={styles.details_panel_value}>
                {country.currencies.map(({ name }) => name).join(", ")}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Top Level Domain</div>
              <div className={styles.details_panel_value}>
                {country.topLevelDomain.map((name) => name)}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Calling Codes</div>
              <div className={styles.details_panel_value}>
                {country.callingCodes.map((code) => `+${code}`)}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Timezones</div>
              <div className={styles.details_panel_value}>
                {country.timezones.map((name) => name).join(", ")}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Native name</div>
              <div className={styles.details_panel_value}>
                {country.nativeName}
              </div>
            </div>
            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Gini Coefficient</div>
              <div className={styles.details_panel_value}>{country.gini}</div>
            </div>
            <div className={styles.details_panel_borders}>
              <div className={styles.details_panel_borders_label}>
                Neighbouring Countries
              </div>
              {borders.length > 0 ? (
                <div className={styles.details_panel_borders_container}>
                  {borders.map(({ flag, name, alpha3Code }) => (
                    <Link key={name} href={`/country/${alpha3Code}`}>
                      <div className={styles.details_panel_borders_country}>
                        <img src={flag} alt={name}></img>
                        <div className={styles.details_panel_name}>{name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div>There are no neighbouring countries, only water..</div>
              )}
            </div>
            <div className={styles.details_panel_images}>
              <div className={styles.details_panel_images_label}>
                Related Images
              </div>
              <div className={styles.details_panel_images_container}>
                {countryImages.map(({ src }, index) => (
                  <div
                    key={index}
                    className={styles.details_panel_images_country}
                  >
                    <img src={src} alt={src}></img>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Country;

export const getStaticPaths = async () => {
  const res = await fetch(`https://restcountries.com/v3.1/all`);

  const countries = await res.json();

  const paths = countries.map((country) => ({
    params: { id: country.alpha3Code },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const country = await getCountry(params.id);

  const countrySummary = await getCountrySummary(country.name);

  const countryImages = await getCountryImages(country.name);

  return {
    props: {
      country,
      countrySummary,
      countryImages,
    },
  };
};
