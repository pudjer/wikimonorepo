import { useState } from "react";
import { observer } from "mobx-react-lite";
import { PageTitle } from "../components/common/PageTitle";
import { PageSpinner } from "../components/common/PageSpinner";
import { SearchBar } from "../components/search/SearchBar";
import { SearchResultsList } from "../components/search/SearchResultsList";
import { useStores } from "../hooks/useStores";

export const SearchPage = observer(function SearchPage() {
  const { searchStore } = useStores();
  const [query, setQuery] = useState("");

  const handleSearch = (q: string) => {
    setQuery(q);
    searchStore.search(q);
  };

  return (
    <>
      <PageTitle>Search Articles</PageTitle>
      <SearchBar onSearch={handleSearch} />
      {searchStore.isLoading && <PageSpinner />}
      <SearchResultsList results={searchStore.results} query={query} isLoading={searchStore.isLoading} />
    </>
  );
});

