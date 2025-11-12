import React from "react";
import "./search-form.scss";
import ResortsSelect from "./resorts-select/resorts-select";
import GuestsSelect from "./guests-select/guests-select";
import SearchButton from "./search-button/search-button";
import DatePicker from 'react-datepicker';
import { useSearchFilters } from '../../contexts/searchFiltersContext';

const SearchForm: React.FC<{ onSearch: () => void }> = ({ onSearch }) => {
    const { filters, setSkiSiteId, setGroupSize, setStartDate, setEndDate } = useSearchFilters();
    const { skiSiteId, groupSize, startDate, endDate } = filters;

    return (
        <div className="search-form">
            <ResortsSelect value={skiSiteId} onChange={skiSiteId => setSkiSiteId(skiSiteId)} />
            <GuestsSelect value={groupSize} onChange={groupSize => setGroupSize(groupSize)} />
            
            <DatePicker className="search-form-date-picker" selected={startDate} onChange={(date) => setStartDate(date)} enableTabLoop={false} />
            <DatePicker className="search-form-date-picker" selected={endDate} onChange={(date) => setEndDate(date)} enableTabLoop={false} />

            <SearchButton onClick={onSearch}/>
        </div>
    );
}

export default SearchForm;