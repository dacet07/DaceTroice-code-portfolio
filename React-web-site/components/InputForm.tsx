import React, { useState, useContext } from "react";
import DOMPurify from "dompurify";
import { LanguageContext } from "../App";
import inputFormNames from "../utils/inputFormNames";
import Button from "./Button";

type InputFormProps = {
  formType: "course" | "company" | "contacts" | "qualification";
  courseType?: string;
};

interface FormData {
  courseType: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  comments: string;
}

const InputForm: React.FC<InputFormProps> = ({ formType, courseType }) => {
  const { language } = useContext(LanguageContext);
  const inputNames = inputFormNames[language];
  if (!courseType) courseType = "";
  const [formData, setFormData] = useState<FormData>({
    courseType: courseType,
    company: "",
    name: "",
    phone: "",
    email: "",
    comments: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    e.target.setCustomValidity("");
    console.log(`handleChange ${e.target.value}`);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value, type } = e.target;

    if (!value) {
      e.target.setCustomValidity(inputNames.fieldRequired);
    } else if (
      type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    ) {
      e.target.setCustomValidity(inputNames.emailNotValid);
    } else if (type === "tel" && !/^\+?[1-9]\d{1,14}$/.test(value)) {
      e.target.setCustomValidity(inputNames.phoneNotValid);
    } else {
      e.target.setCustomValidity(""); // Reset the custom message if valid
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simulate blur event on all inputs
    const formElements = e.currentTarget.elements;
    Array.from(formElements).forEach((element) => {
      if (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA" ||
        element.tagName === "SELECT"
      ) {
        const inputElement = element as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement;
        inputElement.focus(); 
        inputElement.blur(); 
      }
    });

     const adjustedcourseType = formType === "qualification"
     ? `${formData.courseType} kvalifikācijas celšana`
     : formData.courseType;

    // Sanitize input data
    const sanitizedFormData: FormData = {
      courseType: DOMPurify.sanitize(adjustedcourseType),
      company: DOMPurify.sanitize(formData.company),
      name: DOMPurify.sanitize(formData.name),
      phone: DOMPurify.sanitize(formData.phone),
      email: DOMPurify.sanitize(formData.email),
      comments: DOMPurify.sanitize(formData.comments || ""),
    };

   
    if (e.currentTarget.checkValidity()) {
      try {
       
        const response = await fetch("http://localhost:5000/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sanitizedFormData),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Attempt to parse JSON
        const result = await response.json();
        alert(result.message || "Form submitted successfully");
        setFormData({
          courseType: courseType,
          company: "",
          name: "",
          phone: "",
          email: "",
          comments: "",
        });
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to send email");
      }
    } else {
      e.currentTarget.reportValidity();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formType !== "contacts" && (
        <div className="apply-form-item">
          <label className="apply-form-item-label" htmlFor="courseType">
            {inputNames.courseType}
          </label>
          <select
            className="apply-form-item-input"
            name="courseType"
            value={formData.courseType}
            onChange={handleChange}
            required
          >
            <option value="tig">TIG</option>
            <option value="mag">MAG</option>
            <option value="mig">MIG</option>
            <option value="mma">MMA</option>
            <option value="neviens">{inputNames.notChoosen}</option>
          </select>
        </div>
      )}
      {formType == "company" && (
        <div className="apply-form-item">
          <label className="apply-form-item-label" htmlFor="company">
            {inputNames.company}
          </label>
          <input
            className="apply-form-item-input"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
      )}
      <div className={`apply-form-item ${
          formType === "contacts" ? "apply-form-item-contacts" : ""
        }`}>
        <label className="apply-form-item-label" htmlFor="name">
          {formType === "company" ? inputNames.contactPerson : inputNames.name}
        </label>
        <input
          className="apply-form-item-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </div>
      {formType !== "contacts" && (
        <div className="apply-form-item">
          <label className="apply-form-item-label" htmlFor="phone">
            {inputNames.phone}
          </label>
          <input
            className="apply-form-item-input"
            type="tel"
            name="phone"
            placeholder="********"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
      )}
      <div className={`apply-form-item ${
          formType === "contacts" ? "apply-form-item-contacts" : ""
        }`}>
        <label className="apply-form-item-label" htmlFor="email">
          {inputNames.email}
        </label>
        <input
          className="apply-form-item-input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </div>
      <div className={`apply-form-item ${
          formType === "contacts" ? "apply-form-item-contacts" : ""
        }`}>
        <label className="apply-form-item-label" htmlFor="comments">
          {inputNames.comments}
        </label>
        <textarea
          className="apply-form-item-input"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
        />
      </div>
      <div className="apply-form-item">
        <Button type="submit" label={inputNames.send} className="send" />
      </div>
    </form>
  );
};

export default InputForm;
