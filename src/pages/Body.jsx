import React, { useState } from "react"
import { Outlet } from "react-router-dom"

function Body() {
  const [theme, setTheme] = useState("light")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return (
    <div>
      <input
        type="checkbox"
        className="toggle theme-controller"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <Outlet />
    </div>
  )
}

export default Body
