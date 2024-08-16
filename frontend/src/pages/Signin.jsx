import { useState, useEffect } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!form.firstName) {
      formErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!form.lastName) {
      formErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!form.email) {
      formErrors.email = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      formErrors.email = 'Email address is invalid';
      isValid = false;
    }

    if (!form.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
          username: form.email, 
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password
        });
        localStorage.setItem("token", response.data.token);
        console.log(response.data.userId);
        navigate("/dashboard");
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <form onSubmit={handleSubmit}>
            <Heading label={"Sign in"} />
            <SubHeading label={"Enter your information to sign in"} />
            <div>
              <InputBox
                val={form.firstName}
                onChange={handleChange}
                placeholder="Shreyas"
                label="First Name"
                name="firstName"
              />
              {errors.firstName && <span className="error text-red-500">{errors.firstName}</span>}
            </div>
            <div>
              <InputBox
                val={form.lastName}
                onChange={handleChange}
                placeholder="Fatale"
                label="Last Name"
                name="lastName"
              />
              {errors.lastName && <span className="error text-red-500">{errors.lastName}</span>}
            </div>
            <div>
              <InputBox
                val={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                label="Email"
                name="email"
              />
              {errors.email && <span className="error text-red-500">{errors.email}</span>}
            </div>
            <div>
              <InputBox
                val={form.password}
                onChange={handleChange}
                placeholder="Password"
                label="Password"
                name="password"
                type="password"
              />
              {errors.password && <span className="error text-red-500">{errors.password}</span>}
            </div>
            <div className="pt-4">
              <Button label="Sign in" />
            </div>
            <BottomWarning label="Don't have an account?" buttonText="Sign up" to="/signup" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
