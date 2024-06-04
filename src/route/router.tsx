import { Route, Routes } from "react-router-dom";
import { Home } from "../views/home";
import { MainPage } from "../views/main";

export const Router = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main" element={<MainPage />} />
        </Routes>
    </>
  )
}
