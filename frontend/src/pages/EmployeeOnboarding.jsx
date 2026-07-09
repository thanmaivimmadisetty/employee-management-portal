import React, { useState } from "react";
import api from "../utils/api";

const EmployeeOnboarding = () => {

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    previous_company: "",
    previous_designation: "",
    new_designation: "",
    department: "",
    experience: "",
    joining_date: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e)=>{

      e.preventDefault();

      try{

          await api.post("/onboarding",form);

          alert("Application Submitted Successfully!");

          setForm({
              full_name:"",
              email:"",
              phone:"",
              previous_company:"",
              previous_designation:"",
              new_designation:"",
              department:"",
              experience:"",
              joining_date:"",
              address:""
          });

      }catch(err){

          alert("Submission Failed");

      }

  }

  return (

<div className="max-w-3xl mx-auto bg-white shadow rounded p-6">

<h2 className="text-2xl font-bold mb-5">
Employee Joining Form
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<input
name="full_name"
placeholder="Full Name"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="phone"
placeholder="Phone Number"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="previous_company"
placeholder="Previous Company"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="previous_designation"
placeholder="Previous Designation"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="new_designation"
placeholder="Designation in Our Company"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
name="department"
placeholder="Department"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
type="number"
name="experience"
placeholder="Experience (Years)"
className="border p-2 w-full"
onChange={handleChange}
/>

<input
type="date"
name="joining_date"
className="border p-2 w-full"
onChange={handleChange}
/>

<textarea
name="address"
placeholder="Address"
className="border p-2 w-full"
rows="3"
onChange={handleChange}
/>

<button
className="bg-blue-600 text-white px-5 py-2 rounded"
>
Submit
</button>

</form>

</div>

  );

};

export default EmployeeOnboarding;