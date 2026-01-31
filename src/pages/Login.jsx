import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { LandingIntro } from "../components/index";
import ErrorText from "../components/Typography/ErrorText";
import InputText from "../components/Input/InputText";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
    enrollmentNumber: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { emailId, password, enrollmentNumber } = loginObj;

    if (!emailId.trim()) return setErrorMessage("Email Id is required!");
    if (!password.trim()) return setErrorMessage("Password is required!");
    if (!enrollmentNumber.trim())
      return setErrorMessage("Enrollment Number is required!");

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailId,
        password,
      );

      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "Users", user.uid));

      if (!userDoc.exists()) {
        setErrorMessage("User data not found");
        await auth.signOut();
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      if (userData.enrollmentNumber !== enrollmentNumber) {
        setErrorMessage("Incorrect enrollment number");
        await auth.signOut();
        setLoading(false);
        return;
      }

      console.log("Logged in user:", userCredential.user);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("User not found");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email");
          break;
        default:
          setErrorMessage(error.message);
      }
    }

    setLoading(false);
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigate("/dashboard", { replace: true });
  //     }

  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [navigate]);

  return (
    <div className="h-[90vh] bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div>
            <LandingIntro />
          </div>

          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>

            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputText
                  defaultValue={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={loginObj.enrollmentNumber}
                  updateType="enrollmentNumber"
                  containerStyle="mt-4"
                  labelTitle="Enrollment Number"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

              <button
                type="submit"
                className={
                  "btn mt-2 w-full btn-primary" + (loading ? " loading" : "")
                }
              >
                Login
              </button>

              <div className="text-center mt-4">
                Don't have an account yet?{" "}
                <Link to="/register">
                  <span className="hover:text-primary hover:underline cursor-pointer">
                    Register
                  </span>
                </Link>
              </div>
            </form>

            {loading && (
              <div className="flex justify-center mt-4">
                <Icon icon="line-md:loading-loop" className="text-2xl" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
