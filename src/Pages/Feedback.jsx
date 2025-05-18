import { useState } from "react";
import screenshotImg from "../assets/Images/screenshot.jpg";
import Alvas from "../assets/Images/Alvas.png"
import logo from "../assets/Images/logo.png"
import touristBg from "../assets/Images/tourism.jpg"

export default function Feedback() {
const [name, setName] = useState("");
const [usn, setUsn] = useState("");
const [branch, setBranch] = useState("");
const [paymentScreenshot, setPaymentScreenshot] = useState(null);
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();
setSubmitted(false);
setError("");

const data = new FormData();
data.append("name", name);
data.append("usn", usn);
data.append("branch", branch);
data.append("screenshot", paymentScreenshot);

try {
// frontend/src/Feedback.jsx
await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
  method: "POST",
  body: data,
});


  if (res.ok) {
    setSubmitted(true);
    setName("");
    setUsn("");
    setBranch("");
    setPaymentScreenshot(null);
  } else {
    setError("Something went wrong. Try again.");
  }
} catch (err) {
  setError("Server error. Check your connection.");
}
};

return (
<div
className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
style={{
  backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${touristBg})`,

}}
>
<form onSubmit={handleSubmit} className=" p-10 rounded-3xl shadow-2xl w-full max-w-4xl space-y-6 border-4 border-dashed border-blue-400" >
{/* Header Row with Logos */}
<div className="flex justify-between items-center mb-4">
  <img src={Alvas} alt="Left Logo" className="h-24 w-24" />
  
  <div className="text-center">
    <h1 className="text-5xl font-bold text-blue-800 leading-again">
      Wisdom Crew<br />
      <span className="text-2xl font-normal block mt-1">presenting package tour</span>
    </h1>
  </div>
  
  <img src={logo} alt="Right Logo" className="h-24 w-24" />
</div>


    {submitted && (
      <div className="text-green-600 font-semibold text-center">✅ Feedback submitted!</div>
    )}
    {error && (
      <div className="text-red-600 font-semibold text-center">{error}</div>
    )}

    <label for="name" className="text-blue-700 font-semibold mb-4">Name:</label>
    <input
      type="text"
      placeholder="Enter Your Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
      className="w-full px-5 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

<label for="usn" className="text-blue-700 font-semibold mb-4">USN:</label>
    <input
      type="text"
      placeholder="Enter Your USN"
      value={usn}
      onChange={(e) => setUsn(e.target.value)}
      required
      className="w-full px-5 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

<label for="branch" className="text-blue-700 font-semibold mb-4">Branch:</label>
<input
      type="text"
      placeholder="Enter Your Branch"
      value={branch}
      onChange={(e) => setBranch(e.target.value)}
      required
      className="w-full px-5 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
{/* Screenshot Photo Section */}
<div className="mb-12">
  <label className="block text-xl font-semibold text-blue-700 mb-4">Screenshot Sample</label>

  <div className="flex flex-col items-center space-y-4">
    <img
      src={screenshotImg}
      alt="Screenshot"
      className="rounded-xl shadow-lg w-2/3 max-h-[24rem] object-contain"
    />
    <p className="text-xl font-bold text-green-600">Pay Advance 500 & Upload the screenshot Below</p>
  </div>
</div>

{/* File Upload Input */}
<div className="mt-12">
  <label className="block text-xl font-semibold text-blue-700 mb-4">
    Upload the Screenshot
  </label>
  <input
    type="file"
    onChange={(e) => setPaymentScreenshot(e.target.files[0])}
    required
    className="w-full text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-full 
               file:border-0 file:text-base file:font-semibold 
               file:bg-blue-600 file:text-white hover:file:bg-blue-700"
  />
</div>


{/* Info Link above Submit Button */}
<div className="text-center text-blue-700 font-semibold mb-4">
  For more information of the places Follow this account{" "}
  <a
    href="https://www.instagram.com/wisdomcrew_official/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-900 underline hover:text-blue-600"
  >
    Wisdom
  </a>
</div>
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-3 rounded-xl transition-all duration-300"
    >
      Submit Feedback
    </button>
  </form>
</div>
);
}