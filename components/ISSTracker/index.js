import Controls from "../Controls/index";
import Map from "../Map/index";
import useSWR from "swr";

const URL = "https://api.wheretheiss.at/v1/satellites/25544";

export default function ISSTracker() {
  const fetcher = async (url) => {
    const res = await fetch(URL);

    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  };

  const { data, isLoading, error, mutate } = useSWR(URL, fetcher, {
    refreshInterval: 5000,
  });

  return (
    <>
      {data && (
        <>
          {" "}
          <Map longitude={data.longitude} latitude={data.latitude} />
          <Controls
            longitude={data.longitude}
            latitude={data.latitude}
            onRefresh={() => {
              mutate();
            }}
          />{" "}
        </>
      )}
      {error && (
        <>
          <h2>Something went wrong ...</h2>
          <span>
            {error.status} : {error.message}
          </span>
        </>
      )}
      {isLoading && <h2>Loading ...</h2>}
    </>
  );
}
