import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };
  return (
    <>
      <NavBar />
      <SearchBar onSearch={handleSearch} />
      <h1>Home page</h1>
    </>
  );
}
