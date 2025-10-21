import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/Header.tsx";
import Description from "./components/Description.tsx";
import Rank from "./components/Rank.tsx";
import Result from "./components/Result.tsx";
import Search from "./components/Search.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <Description />
    <Rank />
    <Result />
    <Search />
  </StrictMode>
);
