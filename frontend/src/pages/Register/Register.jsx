import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register, fetchCompanies } from "../../services/api";
import "./register.css";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee",
    employeeDetails: {
      companyId: "",
    },
    companyDetails: {
      name: "",
      industry: "",
      logo: "",
      address: "",
    },
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const { data } = await fetchCompanies();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch companies:", err.message);
        setCompanies([]);
      }
    };
    fetchCompanyList();
  }, []);

  const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.url;
    } catch (err) {
      console.error("Logo upload failed:", err.message);
      throw new Error("Logo upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      let updatedForm = { ...form };

      if (form.role === "company" && logoFile) {
        const logoUrl = await uploadLogo(logoFile);
        updatedForm = {
          ...updatedForm,
          companyDetails: { ...updatedForm.companyDetails, logo: logoUrl },
        };
      }

      const payload =
        updatedForm.role === "employee"
          ? {
              ...updatedForm,
              companyDetails: undefined,
            }
          : {
              ...updatedForm,
              employeeDetails: undefined,
            };

      const { data } = await register(payload);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="register-title"><span>J</span>oin Us</h2>
          <div className="register-form-group">
            <label>Username</label>
            <input
              type="text"
              className="register-form-control"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="register-form-group">
            <label>Email</label>
            <input
              type="email"
              className="register-form-control"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="register-form-group">
            <label>Password</label>
            <input
              type="password"
              className="register-form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="register-form-group">
            <label>Role</label>
            <select
              className="register-form-control"
              value={form.role}
              onChange={(e) => {
                const newRole = e.target.value;
                setForm({
                  ...form,
                  role: newRole,
                  employeeDetails: { companyId: "" },
                  companyDetails: {
                    name: "",
                    industry: "",
                    logo: "",
                    address: "",
                  },
                });
              }}
            >
              <option value="employee">Employee</option>
              <option value="company">Company</option>
            </select>
          </div>
          {form.role === "employee" && (
            <div className="register-form-group">
              <label>Select Company</label>
              <select
                className="register-form-control"
                value={form.employeeDetails.companyId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    employeeDetails: { companyId: e.target.value },
                  })
                }
                required
              >
                <option value="">-- Select Company --</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyDetails?.name || "Unnamed Company"}
                  </option>
                ))}
              </select>
            </div>
          )}
          {form.role === "company" && (
            <>
              <div className="register-form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  className="register-form-control"
                  placeholder="Enter company name"
                  value={form.companyDetails.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      companyDetails: { ...form.companyDetails, name: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="register-form-group">
                <label>Industry</label>
                <input
                  type="text"
                  className="register-form-control"
                  placeholder="Enter industry"
                  value={form.companyDetails.industry}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      companyDetails: { ...form.companyDetails, industry: e.target.value },
                    })
                  }
                />
              </div>
              <div className="register-form-group">
                <label>Logo</label>
                <input
                  type="file"
                  className="register-form-control"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
              </div>
              <div className="register-form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="register-form-control"
                  placeholder="Enter company address"
                  value={form.companyDetails.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      companyDetails: { ...form.companyDetails, address: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </>
          )}
          {error && <div className="register-alert register-alert-danger">{error}</div>}
          {success && <div className="register-alert register-alert-success">{success}</div>}
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
      {/* <div className="register-right">
        <img
          src="/images/Register.webp" // Replace with your image URL
          alt="Register Illustration"
          className="register-image"
        />
      </div> */}
    </div>
  );
};

export default Register;
