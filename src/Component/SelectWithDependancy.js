// SelectInputWithDependency.js
import axios from "axios";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const SelectInputWithDependency = ({
  field,
  control,
  setValue,
  depenndantValue,
  getValues,
  defaultValue,
  watchField,
}) => {
  const [options, setOptions] = useState(defaultValue ? [defaultValue] : []);
  const [searchId, setSearchId] = useState(null);
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
      // backgroundColor: state.data.color,
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
      // padding:"1px",
      // fontSize:"5px"
      margin: "-10px !important",
      padding: "-10px !important",
    }),
    valueContainer: (base) => ({
      ...base,
      minHeight: "20px",
      margin: "-10px !important",
      padding: "-10px !important",
    }),
    // valueContainer: (provided, state) => ({
    //   ...provided,
    //   minHeight: '10px',
    //     padding:"1px"
    // }),
  };

  //   console.log("depenndantValue", depenndantValue);
  console.log("watch country", watchField);
  // var searchId = localStorage.getItem(field?.dependency.parent);
  console.log("searchId", searchId);
  const fetchOptions = async (value) => {
    var API_URL;
    var token = sessionStorage.getItem("access_token");
    var headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log("field", field);

    API_URL = `${process.env.REACT_APP_SERVER_API}/api/${field?.dependency.url_template}/${value}`;
    console.log("API_URL", API_URL);
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
  //   useEffect(() => {
  //     console.log("watch", getValues("country"));
  //     fetchOptions();
  //   }, [getValues]);

  useEffect(() => {
    // loadOptionsDependant();
    console.log("value - searchId", searchId);
    console.log("value - watchfield", watchField);
    fetchOptions(searchId);
    if (defaultValue) {
      setOptions([defaultValue]);
      setValue(field?.server_key, defaultValue);
    }
  }, [defaultValue, searchId]);
  useEffect(() => {
    // Your logic here when the value changes
    console.log("Value in localStorage changed:", searchId);
  }, [searchId, field]);

  var myValue = localStorage.getItem(field?.dependency.parent);
  useEffect(() => {
    const stored = JSON.parse(myValue); //countryToOffice="yuyuii"
    // const stored = "cjsdnkcjd"; //countryToOffice="yuyuii"
    console.log("stored", stored);
    setSearchId((prev) => (prev = stored));
  }, [field, myValue]);

  // useMemo(() => {
  //   const myValue = localStorage.getItem(field?.dependency.parent);
  //   const parsedValue = JSON.parse(myValue);
  //   console.log("parsedValue", parsedValue);
  //   setSearchId(parsedValue);
  // }, [searchId, field]);

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
          }}
          placeholder={`Select ${field?.name}`}
        />
      )}
      //   rules={{ required: true }}
    />
  );
};

export default SelectInputWithDependency;
