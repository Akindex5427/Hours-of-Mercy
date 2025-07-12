import React from "react";
import ContactPage from "../pages/ContactPage";
import GivingPage from "../pages/GivingPage";

// Simple component to test our pages
const TestPages = () => {
  const [currentPage, setCurrentPage] = React.useState("contact");

  return (
    <div>
      <div
        style={{ padding: "20px", background: "#f0f0f0", textAlign: "center" }}
      >
        <h2>Page Test</h2>
        <button
          onClick={() => setCurrentPage("contact")}
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            backgroundColor: currentPage === "contact" ? "#1976d2" : "#ccc",
            color: currentPage === "contact" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Contact Page
        </button>
        <button
          onClick={() => setCurrentPage("giving")}
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            backgroundColor: currentPage === "giving" ? "#1976d2" : "#ccc",
            color: currentPage === "giving" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Giving Page
        </button>
      </div>

      <div>
        {currentPage === "contact" && <ContactPage />}
        {currentPage === "giving" && <GivingPage />}
      </div>
    </div>
  );
};

export default TestPages;
