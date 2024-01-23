// SearchBar.js is a functional React component designed for a search input functionality.
// It provides a user interface for entering a search term and triggering a search operation.
// The component:
// - Accepts an 'onSearch' prop, which is a function to be called when a search is performed.
// - Uses a 'searchTerm' state to keep track of the user's input.
// - Includes an input field for the user to type their search term, with the value linked to 'searchTerm'.
// - The input field's onChange event updates 'searchTerm' with the current value in the input field.
// - A button is provided to trigger the search. When clicked, it calls 'handleSearch', which in turn invokes the 'onSearch' function passed as a prop with the current 'searchTerm'.
// - Styling is applied via 'styles.css', and the component uses CSS classes for layout and appearance.

import React, { useState } from 'react'
import './styles.css'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    onSearch(searchTerm)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Pesquisar projetos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Pesquisar</button>
    </div>
  )
}

export default SearchBar
