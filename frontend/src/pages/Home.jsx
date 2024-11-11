import React from 'react';
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <>
      <NavBar />
      <SearchBar />
      <h1>Home page</h1>
    </>
  );
}
