import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, MapPin, Clock, Package } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SearchForm, { SearchParams } from '../components/SearchForm';
import { mockListings } from '../data/mockData';
import { Listing } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchParams>({
    source: searchParams.get('source') || '',
    destination: searchParams.get('destination') || '',
    date: searchParams.get('date') || '',
    isFragile: searchParams.get('isFragile') === 'true',
    weight: Number(searchParams.get('weight')) || 5,
    urgency: (searchParams.get('urgency') as 'normal' | 'express') || 'normal'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortOption, setSortOption] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'rating'>('date_asc');

  useEffect(() => {
    handleSearch(searchCriteria);
  }, []);

  const handleSearch = (params: SearchParams) => {
    setSearchCriteria(params);
    
    // Update URL search params
    setSearchParams({
      source: params.source,
      destination: params.destination,
      date: params.date,
      ...(params.isFragile && { isFragile: 'true' }),
      ...(params.weight && { weight: params.weight.toString() }),
      ...(params.urgency && { urgency: params.urgency })
    });
    
    // Filter listings based on search criteria
    let results = mockListings.filter(listing => {
      // Match source and destination
      const sourceMatch = listing.source.toLowerCase().includes(params.source.toLowerCase());
      const destMatch = listing.destination.toLowerCase().includes(params.destination.toLowerCase());
      
      // Match date if provided
      let dateMatch = true;
      if (params.date) {
        const searchDate = new Date(params.date).setHours(0, 0, 0, 0);
        const listingDate = new Date(listing.departureDate).setHours(0, 0, 0, 0);
        dateMatch = searchDate === listingDate;
      }
      
      // Match fragile requirement if needed
      let fragileMatch = true;
      if (params.isFragile) {
        fragileMatch = listing.acceptsFragile;
      }
      
      // Match weight capacity
      const weightMatch = listing.capacity.weight >= params.weight;
      
      return sourceMatch && destMatch && dateMatch && fragileMatch && weightMatch;
    });
    
    // Apply price filter
    results = results.filter(listing => 
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'date_asc':
        results.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
        break;
      case 'rating':
        // This would require user data to sort by rating
        // For now, we'll keep the default
        break;
    }
    
    setFilteredListings(results);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    if (e.target.id === 'min-price') {
      setPriceRange([newPrice, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], newPrice]);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as 'price_asc' | 'price_desc' | 'date_asc' | 'rating');
  };

  const applyFilters = () => {
    handleSearch(searchCriteria);
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setSortOption('date_asc');
    setSearchCriteria({
      source: '',
      destination: '',
      date: '',
      isFragile: false,
      weight: 5,
      urgency: 'normal'
    });
    setSearchParams({});
    setFilteredListings(mockListings);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Available Trips</h1>
          <SearchForm onSearch={handleSearch} className="bg-white shadow rounded-lg" />
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Sidebar Filters for Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">${priceRange[0]}</span>
                    <span className="text-gray-600">${priceRange[1]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="min-price" className="block text-sm text-gray-600">Min</label>
                      <input
                        type="number"
                        id="min-price"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={handlePriceChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="max-price" className="block text-sm text-gray-600">Max</label>
                      <input
                        type="number"
                        id="max-price"
                        min={priceRange[0]}
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sort By</h3>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="date_asc">Departure: Earliest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={applyFilters}
                  className="w-full bg-teal-500 text-white font-medium py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full bg-white text-gray-700 font-medium py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={toggleFilters}
              className="flex items-center justify-center w-full bg-white text-gray-700 font-medium py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">${priceRange[0]}</span>
                      <span className="text-gray-600">${priceRange[1]}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="mobile-min-price" className="block text-sm text-gray-600">Min</label>
                        <input
                          type="number"
                          id="mobile-min-price"
                          min="0"
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={handlePriceChange}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="mobile-max-price" className="block text-sm text-gray-600">Max</label>
                        <input
                          type="number"
                          id="mobile-max-price"
                          min={priceRange[0]}
                          value={priceRange[1]}
                          onChange={handlePriceChange}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sort By</h3>
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="date_asc">Departure: Earliest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Rating: High to Low</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={applyFilters}
                    className="w-full bg-teal-500 text-white font-medium py-2 rounded-md hover:bg-teal-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full bg-white text-gray-700 font-medium py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {searchCriteria.source && searchCriteria.destination && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <MapPin size={18} className="text-teal-500 mr-1" />
                    <span className="text-gray-700">
                      <span className="font-medium">{searchCriteria.source}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{searchCriteria.destination}</span>
                    </span>
                  </div>
                  
                  {searchCriteria.date && (
                    <div className="flex items-center">
                      <Clock size={18} className="text-teal-500 mr-1" />
                      <span className="text-gray-700">
                        {new Date(searchCriteria.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {searchCriteria.weight > 0 && (
                    <div className="flex items-center">
                      <Package size={18} className="text-teal-500 mr-1" />
                      <span className="text-gray-700">{searchCriteria.weight}kg</span>
                    </div>
                  )}
                  
                  {searchCriteria.isFragile && (
                    <div className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                      Fragile
                    </div>
                  )}
                  
                  {searchCriteria.urgency === 'express' && (
                    <div className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                      Express
                    </div>
                  )}
                </div>
              </div>
            )}

            {filteredListings.length > 0 ? (
              <div className="space-y-6">
                <p className="text-gray-700">
                  Showing {filteredListings.length} {filteredListings.length === 1 ? 'trip' : 'trips'}
                </p>
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                  <MapPin size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any trips matching your search criteria. Try adjusting your filters or search for different locations.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;