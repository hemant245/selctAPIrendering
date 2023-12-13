import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// import DynamicSelect from "./Select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import AsyncSelect from "react-select/async";
import SelectInputWithDependency from "./SelectWithDependancy";
import SelectInputWithoutDependency from "./SelectWithoutDependancy";

export const RenderFormFields = (
  fields,
  mode,
  serverKey,
  endpoint,
  dataFields,
  dataId,
  redirect,
  setIsUpdate
) => {
  const [formData, setFormData] = useState({});
  const [data, setData] = useState({});
  const navigate = useNavigate();
  // console.log("fields", setIsUpdate(true));
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState(0);
  const [countryId, setCountryId] = useState("");
  const [periodDuration, setPeriodDuration] = useState("");
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  let userId = localStorage.getItem("id");

  var token = sessionStorage.getItem("access_token");
  // useMemo(() => {
  //   // Replace 'fieldName' with the actual field you want to watch
  //   let watchCounty = watch("country");
  //   setCountryId(watchCounty);
  // }, [watch]);
  var headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  console.log("mode", mode);
  //styles for react-selet
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

  // const watchCountry = watch("countryToOffice");
  const onFormSubmit = async (data) => {
    setData(data);
    console.log("data on submit", data);
    console.log("fields", fields);
    console.log("endopint", endpoint);
    var token = sessionStorage.getItem("access_token");
    fields.forEach((schemaObj) => {
      const key = schemaObj.server_key;

      // Check if the key exists in the data and if its type is "select" with options_url
      if (
        data.hasOwnProperty(key) &&
        schemaObj.type === "select" &&
        schemaObj.options_url
      ) {
        const propertyValue = data[key];
        data[key] = { id: propertyValue };
      }
    });
    console.log("modifiedData", data);
    // Assign value to a key
    // console.log("item_key", token);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    console.log("process.env.PUBLIC_URL", process.env.REACT_APP_SERVER_API);
    console.log("data in before block", data);
    let reqData;
    if (endpoint === "customers" || dataId) {
      reqData = data;
    } else if (endpoint === "addresses") {
      reqData = { ...data, customer: { id: userId } };
    } else {
      reqData = { ...data };
    }
    console.log("reqData", reqData);
    try {
      var res;
      if (dataId && mode == "edit") {
        res = await axios.put(
          `${process.env.REACT_APP_SERVER_API}/api/${endpoint}/${dataId}`,
          { ...reqData, id: dataId },
          { ...headers }
        );
      } else {
        console.log("inside try block", headers);
        console.log("reqData", reqData);
        res = await axios.post(
          `${process.env.REACT_APP_SERVER_API}/api/${endpoint}`,
          reqData,
          { ...headers }
        );
      }
      console.log("data in try block", data);
      console.log("res.data", res);
      let custData = res.data.data;
      console.log("custData", custData);
      if (res.status === 201) {
        alert("Data Created successfully!!");
        console.log("redirect status", redirect);
        if (redirect) {
          navigate(`/${endpoint}`);
        } else {
          console.log("endpoint in request", endpoint);
          if (endpoint === "addresses") {
            setIsUpdate(true);
          } else if (endpoint === "customers") {
            localStorage.setItem("id", custData.id);
            localStorage.setItem("custId", custData.id);
            localStorage.setItem("my check", "updated");

            setIsUpdate(false);
          } else {
            setIsUpdate(false);
          }
          return;
        }
      } else if (res.status === 200) {
        alert("Data updated successfully!!");
        navigate(`/${endpoint}`);
      }
    } catch (err) {
      console.log("data in catch block", data);

      console.log("error", err.message);
    }
  };

  const handleInputChange = (e, serverKey) => {
    console.log("value", e.target.checked);
    const { name, value, type, checked, files } = e.target;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;
    setFormData((prevData) => ({
      ...prevData,
      [serverKey]: {
        ...prevData[serverKey],
        [name]: newValue,
      },
    }));
  };

  const currencyFormat = (value, currency) => {
    var num = parseInt(value ? value.replace(",", "") : "0");
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(num);
  };

  const handleAmountChange = (event, serverKey, currency) => {
    // const
    // 5,75,75,75,775
    console.log("first value", event.target.value);
    const rawValue = event.target.value.replace(/,/g, ""); // Remove commas
    // 5757575775
    const decimalString = "0.54";
    let amoutchck = parseFloat(rawValue.replace(/\./g, ""));
    console.log("amoutchck", amoutchck);
    const floatValue = parseFloat(rawValue);
    const integerValue = Math.round(floatValue * 100);
    console.log("rawValue", integerValue);
    // var num = parseInt(event.target.value ? event.target.value : 0);
    // console.log("num", num);
    // if (/^\d*\.?\d{0,2}$/.test(rawValue)) {
    // Allow only numbers and up to two decimal places
    let amountValue = new Intl.NumberFormat("en-IN", {
      // style: "currency",
      currency: currency,
    }).format(rawValue);
    // }
    //  5,75,75,75,775
    let updatedAmount = amountValue.includes("₹")
      ? amountValue?.replace(/₹/g, "")
      : amountValue;
    console.log("amountValue", amountValue);
    setFormData((prevData) => ({
      ...prevData,
      [serverKey]: {
        ...prevData[serverKey],
        [event.target.name]: updatedAmount,
      },
      formData: {
        period: "7 days",
      },
    }));
  };

  const handlePeriodChange = (event, serverKey) => {
    console.log("event.target.value", event.target.value);
    const { name, value } = event.target;
    console.log("serverKey", serverKey);
    setPeriod(event.target.value);

    console.log("lklklkl period :: ", period + periodDuration);

    setFormData((prevData) => ({
      ...prevData,
      [serverKey]: {
        ...prevData[serverKey],
        [name]: value,
      },
    }));
    console.log("period :: ", period + periodDuration);
  };

  const handlePeriodOption = (e) => {
    setPeriodDuration(e.target.value);
  };

  useEffect(() => {
    setTimeout(() => {}, 1000);
    // console.log("getValues()", getValues());
    // loadOptionsDependant();
  }, [fields, setValue, dataFields]);

  // useEffect(() => {
  //   console.log('watch("countryToOffice)', watch("countryToOffice"));
  // }, [watch]);
  useEffect(() => {
    if (mode === "edit") {
      console.log("dataFields", dataFields);
    }
    // loadOptionsDependant();
  }, [setValue, mode]);
  return fields?.map((field, idx) => {
    if (field.type === "form") {
      return (
        <form
          key={field?.title + idx + Date.now()}
          className={field?.css_class}
        >
          <h3>{field.title}</h3>
          {RenderFormFields(field.fields, field.server_key)}
        </form>
      );
    } else {
      // if (field.type === "submit") {
      //   hasSubmitButton = true; // Set the flag if a submit button is found
      // }
      // handleSubmit={id? ()=>onSubmit()}
      return (
        <form key={field.name} onSubmit={handleSubmit(onFormSubmit)}>
          {/* {field.isEditable ? ( */}
          <label>
            {field.label}{" "}
            {field?.validation?.required ? (
              <span className={`form-required`}>*</span>
            ) : null}
          </label>
          {/* ) : null} */}
          {field.type === "text" || field.type === "email" ? (
            <div>
              <input
                type={field?.type}
                defaultValue={
                  !dataFields ? null : dataFields[field?.server_key]
                }
                readOnly={
                  mode === "view"
                    ? true
                    : mode === "edit"
                    ? !field?.isEditable
                    : false
                }
                {...register(field?.server_key, {
                  required:
                    field?.validation?.required && field?.isEditable
                      ? `${field?.label} is required`
                      : false,
                  pattern:
                    field?.validation?.pattern && field?.validation?.pattern,
                })}
                className={`${
                  errors[field?.name] ? "inputError" : "customInput"
                }`}
                required={field?.validation?.required}
              />
              {errors[field?.name] && (
                <span
                  style={{
                    color: "#e15d2e",
                    display: "inline-block",
                    fontSize: "12px",
                  }}
                >
                  {errors[field?.name].message}
                </span>
              )}
            </div>
          ) : field.type === "number" ? (
            <div>
              <input
                type={"number"}
                defaultValue={
                  !dataFields ? null : dataFields[field?.server_key]
                }
                {...register(field?.server_key, {
                  required: field?.validation?.required
                    ? `${field?.label} is required`
                    : false,
                  pattern:
                    field?.validation?.pattern && field?.validation?.pattern,
                })}
                className={`${
                  errors[field?.name] ? "inputError" : "customInput"
                }`}
                required={field?.validation?.required}
              />
              {errors[field?.name] && (
                <span
                  style={{
                    color: "#e15d2e",
                    display: "inline-block",
                    fontSize: "12px",
                  }}
                >
                  {errors[field?.name].message}
                </span>
              )}
            </div>
          ) : field.type === "tel" ? (
            <div>
              <input
                type={field?.type}
                defaultValue={
                  !dataFields ? null : dataFields[field?.server_key]
                }
                {...register(field?.server_key, {
                  required: field?.validation?.required
                    ? `${field?.label} is required`
                    : false,
                  pattern:
                    field?.validation?.pattern && field?.validation?.pattern,
                })}
                className={`${
                  errors[field?.name] ? "inputError" : "customInput"
                }`}
                required={field?.validation?.required}
              />
              {errors[field?.name] && (
                <span
                  style={{
                    color: "#e15d2e",
                    display: "inline-block",
                    fontSize: "12px",
                  }}
                >
                  {errors[field?.name].message}
                </span>
              )}
            </div>
          ) : field.type === "amount" ? (
            <>
              <span style={{ display: "flex" }}>
                <span>{field?.currencySymbol}</span>
                <input
                  type="text"
                  className={"customInput"}
                  name={field.name}
                  value={formData[serverKey] && formData[serverKey]?.amount}
                  onChange={(e) =>
                    handleAmountChange(e, serverKey, field?.currency)
                  }
                />
              </span>
            </>
          ) : field.type === "file" ? (
            <>
              <input
                type="file"
                accept={field.accept}
                {...register(field?.server_key, {
                  required: field?.validation?.required
                    ? `${field?.label} is required`
                    : false,
                  pattern:
                    field?.validation?.pattern && field?.validation?.pattern,
                })}
                className={"customInput"}
                name={field.name}
              />
            </>
          ) : field.type === "period" ? (
            <div style={{ margin: "1px", display: "flex", gap: "2%" }}>
              <input
                type="number"
                className="periodmain"
                name={field.name}
                style={{ width: "80px" }}
                onChange={(e) => handlePeriodChange(e, serverKey)}
              />
              <select
                className="periodselect"
                onChange={(e) => handlePeriodOption(e)}
                value={periodDuration}
                name={field.name + "-unit"} // Adjust the name for the select box
              >
                <option value="">Select Duration</option>
                <option value="days">Days</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
                {/* Add more options as needed */}
              </select>
            </div>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              className="form-check-input"
              name={field.name}
              checked={formData[serverKey]?.[field.name] || false}
              onChange={(e) => handleInputChange(e, serverKey)}
            />
          ) : field.type === "radio" ? (
            <span className="radio-group">
              {field.options.map((option) => (
                <div key={option + field.name} className="input-radio">
                  <input
                    type="radio"
                    className="form-text"
                    name={field.name}
                    value={option}
                    checked={formData[serverKey]?.[field.name] === option}
                    onChange={(e) => handleInputChange(e, field.server_key)}
                  />
                  {option}
                </div>
              ))}
            </span>
          ) : field.type === "select" && field.dependency ? (
            <>
              <SelectInputWithDependency
                key={field.name}
                field={field}
                control={control}
                setValue={setValue}
                depenndantValue={field?.dependency}
                // getValues={watch}
                defaultValue={
                  dataFields
                    ? {
                        value: dataFields[field?.server_key]?.id,
                        label: dataFields[field?.server_key]?.name,
                      }
                    : []
                }
                // watchField={watchCountry} // Assuming watchCountry is the correct value
              />
            </>
          ) : field.type === "select" && !field.dependency ? (
            <>
              {field?.options_url ? (
                <SelectInputWithoutDependency
                  key={field.name}
                  {...{
                    field,
                    control,
                    setValue,
                    defaultValue: dataFields
                      ? {
                          value: dataFields[field?.server_key]?.id,
                          label: dataFields[field?.server_key]?.name,
                        }
                      : [],
                  }}
                />
              ) : (
                <select
                  {...register(field?.server_key, {
                    required: field.validation
                      ? `${field?.label} is required`
                      : false,
                  })}
                  className={`${
                    errors[field?.name] ? "inputError" : "customInput"
                  }`}
                >
                  {field?.options?.map((option, i) => (
                    <option key={option.value_key + i} value={option.value_key}>
                      {option.display_key}
                    </option>
                  ))}
                </select>
              )}
            </>
          ) : field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[serverKey]?.[field.name] || ""}
              onChange={(e) => handleInputChange(e, serverKey)}
            ></textarea>
          ) : field.type === "file" ? (
            <input
              type="file"
              name={field.name}
              onChange={(e) => handleInputChange(e, serverKey)}
            />
          ) : field.type === "date" ? (
            // <input
            //   type="date"
            //   className="formDate"
            //   name={field.name}
            //   onChange={(e) => handleInputChange(e, serverKey)}
            // />
            <>
              <input
                type="date"
                defaultValue={
                  !dataFields ? null : dataFields[field?.server_key]
                }
                {...register(field?.server_key, {
                  valueA: false,
                  required: field.validation
                    ? `${field?.label} is required`
                    : false,
                  pattern:
                    field?.validation?.pattern && field?.validation?.pattern,
                })}
                className={`${errors[field?.name] ? "inputError" : "formDate"}`}
                required={field?.validation?.required}
              />
              {errors[field?.name] && (
                <span
                  style={{
                    color: "#e15d2e",
                    display: "inline-block",
                    fontSize: "12px",
                  }}
                >
                  {errors[field?.name].message}
                </span>
              )}
            </>
          ) : field.type === "file" ? (
            <>
              <input
                type="file"
                accept={field.accept}
                {...register(field?.server_key, {
                  required: field?.validation?.required
                    ? `${field?.label} is required`
                    : false,
                  pattern:
                    field?.validation?.pattern && field?.validation?.pattern,
                })}
                className={"customInput"}
                name={field.name}
              />
            </>
          ) : null}
          {field.type === "submit" && (
            <button
              type="submit"
              // onClick={(e) => handleSubmit(e, serverKey)}
            >
              {field.label}
            </button>
          )}
        </form>
      );
    }
  });
};

// <select
//   {...register(field?.server_key, {
//     required: field.validation
//       ? `${field?.label} is required`
//       : false,
//   })}
//   className={`${
//     errors[field?.name] ? "inputError" : "customInput"
//   }`}
// >
//   {field.options.map((option) => (
//     <option key={option} value={option}>
//       {option}
//     </option>
//   ))}
// </select>
