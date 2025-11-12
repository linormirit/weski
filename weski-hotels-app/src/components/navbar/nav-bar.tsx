import React from "react";
import "./nav-bar.scss";
import WeSkiLogo from "../weski-logo/weski-logo";
import SearchForm from "../search-form/search-form";

const NavBar: React.FC<{ onSearch: () => void }> = ({ onSearch }) => {
  return (
    <>
      <div className="nav-bar">
        <WeSkiLogo />
        <SearchForm onSearch={onSearch} />
      </div>
    </>
  );
};

export default NavBar;
