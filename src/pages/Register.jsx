import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../components/firebase";
import LandingIntro from "../components/LandingIntro";
import ErrorText from "../components/Typography/ErrorText";
import InputText from "../components/Input/InputText";
import { Icon } from "@iconify/react";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    password: "",
    emailId: "",
    enrollmentNumber: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { name, emailId, password, enrollmentNumber } = registerObj;

    if (!name.trim()) return setErrorMessage("Name is required!");
    if (!emailId.trim()) return setErrorMessage("Email Id is required!");
    if (!password.trim()) return setErrorMessage("Password is required!");
    if (!enrollmentNumber.trim())
      return setErrorMessage("Enrollment Number is required!");

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailId,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        name: name,
        enrollmentNumber: registerObj.enrollmentNumber,
        uid: user.uid,
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      {loading ? (
        <Icon icon="line-md:loading-loop" className="text-4xl mx-auto" />
      ) : (
        <div className="card mx-auto w-full max-w-5xl shadow-xl">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            <div>
              <LandingIntro />
            </div>

            <div className="py-24 px-10">
              <h2 className="text-2xl font-semibold mb-2 text-center">
                Register
              </h2>

              <form onSubmit={submitForm}>
                <div className="mb-4">
                  <InputText
                    defaultValue={registerObj.name}
                    updateType="name"
                    containerStyle="mt-4"
                    labelTitle="Name"
                    name="name"
                    updateFormValue={updateFormValue}
                  />

                  <InputText
                    defaultValue={registerObj.enrollmentNumber}
                    updateType="enrollmentNumber"
                    containerStyle="mt-4"
                    labelTitle="Enrollment Number"
                    name="enrollmentNumber"
                    updateFormValue={updateFormValue}
                    type="number"
                  />

                  <InputText
                    defaultValue={registerObj.emailId}
                    updateType="emailId"
                    containerStyle="mt-4"
                    labelTitle="Email Id"
                    updateFormValue={updateFormValue}
                  />

                  <InputText
                    defaultValue={registerObj.password}
                    type="password"
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                  />
                </div>

                <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

                <button
                  type="submit"
                  className={
                    "btn mt-2 w-full btn-primary" + (loading ? " loading" : "")
                  }
                >
                  Register
                </button>

                <div className="text-center mt-4">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="hover:text-primary hover:underline cursor-pointer">
                      Login
                    </span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
