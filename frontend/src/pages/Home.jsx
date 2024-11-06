import React from 'react';
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Home() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSearch = (query) => {
    console.log("Searching for:", query); // Log the search query

    // Build the URL with search parameters
    const { location, keywords } = query;
    const searchParams = new URLSearchParams();

    if (location) {
      searchParams.append('location', location);
    }
    if (keywords) {
      searchParams.append('keywords', keywords);
    }

    // Navigate to the Feed page with query parameters
    navigate(`/feed?${searchParams.toString()}`);
  };

  return (
    <>
      <NavBar />
      <SearchBar onSearch={handleSearch} />
      <h1>Home page</h1>
    </>
  );
}
