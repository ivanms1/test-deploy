const customStyles = {
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#2F8BDF",
    borderRadius: "20px",
    height: 24,
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
  control: (provided) => ({
    ...provided,
    border: "none",
    borderRadius: "none",
    alignItems: "flex-start",
    minHeight: 26,
  }),
  indicatorsContainer: () => ({
    display: "none",
  }),
};

export default customStyles;
