import React, { useEffect, useState } from "react";
// import "../forms/form.css";
import "./DynamicForm.css";
import { Controller, useForm } from "react-hook-form";
// import Select from "./elements/Select";
// import Table from "./Table/Table";
import axios from "axios";
import { RenderFormFields } from "./RendorFormFields";
// import DynamicTable from "./Table/DynamicTable";
// import { redirect } from "react-router-dom";
function DynamicForm({ config, datafield, dataId, mode, redirection }) {
  const [formData, setFormData] = useState({});
  const [customerData, setCustomerData] = useState([]);
  // console.log("config", config);
  const [update, setIsUpdate] = useState(false);
  const [amount, setAmount] = useState("");
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  // console.log("redirect check", redirection);
  var token = sessionStorage.getItem("access_token");
  let userId = localStorage.getItem("id");
  const getCustomers = async (endpoint, token) => {
    // console.log("inside else");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      console.log("userId", userId);
      let res = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/api/customers/${userId}`,
        { ...headers }
      );
      console.log("res", res);
      let customerData = await res.data;
      console.log("address data", customerData);
      setCustomerData(customerData.addresses);
    } catch (err) {
      console.log("inside catch block");

      console.log("Error messsage :;", err);
    }
    // }
  };
  const AddressAction = [
    {
      name: "View",
      data: (data) => {
        console.log("data in action", data);
        // navigate(`/officeDetails/${data.id}`);
      },
    },
  ];

  useEffect(() => {
    getCustomers("addresses", token);
  }, [userId, update]);

  let chek = Date.now();
  return (
    <div className="form-section">
      {config?.map((form, idx) => {
        return form?.type === "form" ? (
          <React.Fragment key={idx + form.title + chek}>
            <div className="grid-col-12 mainborderform">
              <h3>{form.title}</h3>
              <div className={form?.css_class}>
                {RenderFormFields(
                  form.fields,
                  mode,
                  form.server_key,
                  form.endpoint,
                  datafield,
                  dataId,
                  redirection
                )}
              </div>
            </div>
          </React.Fragment>
        ) : form?.type === "formArray" ? (
          <React.Fragment key={idx + form.title + chek}>
            <h3>{form.title}</h3>
            <div className={form?.css_class}>
              {RenderFormFields(
                form.fields,
                mode,
                form.server_key,
                form.endpoint,
                null,
                null,
                null,
                setIsUpdate
              )}
            </div>
            <h2>Addresses</h2>
            <div>
              {/* {
                <DynamicTable
                  endpoint={`${form.endpoint}/${userId}`}
                  headItems={form.fields}
                  bodyData={customerData}
                  isPagination={false}
                  actions={AddressAction}
                />
              } */}
            </div>
          </React.Fragment>
        ) : null;
      })}
    </div>
  );
}

export default DynamicForm;
