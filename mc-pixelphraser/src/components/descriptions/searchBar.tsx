import { SearchBarProps } from "../../interfaces/searchBarProps";

export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => (
  <div style={{ marginBottom: '1rem', width: '100%' }}>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search by Name or Description"
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: '2px solid #ccc',
        backgroundColor: '#f9f9f9',
        fontSize: '1rem',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease', 
      }}
      onFocus={(e) => e.target.style.borderColor = '#007bff'} 
      onBlur={(e) => e.target.style.borderColor = '#ccc'} 
    />
  </div>
);
