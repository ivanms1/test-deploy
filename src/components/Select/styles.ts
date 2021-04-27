const customStyles = {
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#2F8BDF",
    borderRadius: "20px",
    color: "#fff",
    height: 24,
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: 12,
    color: "#fff",
    paddingLeft: 10,
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "#F1F1F1",
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
