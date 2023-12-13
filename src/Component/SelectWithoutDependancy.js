// SelectInputWithoutDependency.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const SelectInputWithoutDependency = ({
  field,
  control,
  setValue,
  defaultValue,
}) => {
  const [options, setOptions] = useState(defaultValue ? [defaultValue] : []);
  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 15,
      minHeight: 15,
    }),
    control: (provided, state) => ({
      ...provided,
      height: "5px",
      minHeight: "25px",
      fontSize: "12px",
      width: "160px",
    }),
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? "bold" : "normal",
      color: "black",
      fontSize: "12px",
      width: "auto",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.data.color,
      fontSize: state.selectProps.myFontSize,
    }),

    indicatorsContainer: (provided, state) => ({
      ...provided,
      display: "block",
      margin: "-10px !important",
      padding: "-10px !important",
    }),
    valueContainer: (base) => ({
      ...base,
      minHeight: "20px",
      margin: "-10px !important",
      padding: "-10px !important",
    }),
  };
  const fetchOptions = async () => {
    var API_URL;
    var token = sessionStorage.getItem("access_token");
    var headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    API_URL = `${process.env.REACT_APP_SERVER_API}/api/${field?.options_url}`;

    try {
      const response = await axios.get(API_URL, { ...headers });
      const loadedData = response.data.data;
      const optionsData = loadedData.map((optionValue) => ({
        value: optionValue.id,
        label: optionValue.name || optionValue.officeName,
      }));
      setOptions(optionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setOptions([]);
    }
  };
  useEffect(() => {
    fetchOptions();
    if (defaultValue) {
      setOptions([defaultValue]);
    }
  }, [field?.options_url, defaultValue]);

  return (
    <Controller
      name={field?.server_key}
      control={control}
      defaultValue={defaultValue.id}
      render={({ field: field2 }) => (
        <Select
          options={options}
          isSearchable
          defaultValue={defaultValue ? options[0] : undefined}
          styles={selectStyles}
          onChange={(option) => {
            const selectedValue = option ? option.value : null;
            field2.onChange(selectedValue);
            console.log("selectedValue", selectedValue);
            setValue(field2.name, selectedValue);
            // var myvalue = { [field?.server_key]: selectedValue };
            localStorage.setItem(
              field?.server_key,
              JSON.stringify(selectedValue)
            );
          }}
          placeholder={`Select ${field?.name}`}
        />
      )}
    />
  );
};

export default SelectInputWithoutDependency;
