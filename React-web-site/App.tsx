import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, createContext } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Sertification from "./pages/Sertification";
import Learner from "./pages/Learner";
import FAQ from "./pages/FAQ";
import Contacts from "./pages/Contacts";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import "./assets/styles/main.scss";

import { Language } from "./types/types";

const initialLanguageContext = {
  language: "lv" as Language,
  setLanguage: (language: Language) => {},
};

export const LanguageContext = createContext(initialLanguageContext);

function App() {
  const [language, setLanguage] = useState<Language>("lv");
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              {/* Redirect from root path to /lv */}
              <Route path="/" element={<Navigate to="/lv" />} />
              {/* Latvian Routes */}
              <Route path="/lv">
                <Route index element={<Home />} />
                <Route path="par-mums">
                  <Route index element={<About type="about" />} />
                  <Route path="uznemums" element={<About type="company" />} />
                  <Route path="komanda" element={<About type="team" />} />
                  <Route
                    path="dokumenti"
                    element={<About type="documents" />}
                  />
                  <Route
                    path="pakalpojumi"
                    element={<About type="services" />}
                  />
                </Route>
                <Route path="kursi">
                  <Route index element={<Courses type="all" />} />
                  <Route path="tig" element={<Courses type="tig" />} />
                  <Route path="mag" element={<Courses type="mag" />} />
                  <Route path="mig" element={<Courses type="mig" />} />
                  <Route path="mma" element={<Courses type="mma" />} />
                  <Route
                    path="kvalifikacija"
                    element={<Courses type="qualification" />}
                  />
                  <Route
                    path="uznemumiem"
                    element={<Courses type="companies" />}
                  />
                  <Route
                    path="bezdarbniekiem"
                    element={<Courses type="unemployed" />}
                  />
                  <Route
                    path="ka-izveleties"
                    element={<Courses type="howToChoose" />}
                  />
                </Route>
                <Route path="sertifikacija" element={<Sertification />} />
                <Route path="izglitojamajiem" element={<Learner />} />
                <Route path="buj" element={<FAQ />} />
                <Route path="kontakti" element={<Contacts />} />
                <Route path="lapas-karte" element={<Sitemap />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* English Routes */}
              <Route path="/en">
                <Route index element={<Home />} />
                <Route path="about">
                  <Route index element={<About type="about" />} />
                  <Route path="company" element={<About type="company" />} />
                  <Route path="team" element={<About type="team" />} />
                  <Route
                    path="documents"
                    element={<About type="documents" />}
                  />
                  <Route path="services" element={<About type="services" />} />
                </Route>
                <Route path="courses">
                  <Route index element={<Courses type="all" />} />
                  <Route path="tig" element={<Courses type="tig" />} />
                  <Route path="mag" element={<Courses type="mag" />} />
                  <Route path="mig" element={<Courses type="mig" />} />
                  <Route path="mma" element={<Courses type="mma" />} />
                  <Route
                    path="qualification"
                    element={<Courses type="qualification" />}
                  />
                  <Route
                    path="companies"
                    element={<Courses type="companies" />}
                  />
                  <Route
                    path="unemployed"
                    element={<Courses type="unemployed" />}
                  />
                  <Route
                    path="how-to-choose"
                    element={<Courses type="howToChoose" />}
                  />
                </Route>
                <Route path="certification" element={<Sertification />} />
                <Route path="learner" element={<Learner />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="sitemap" element={<Sitemap />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Russian Routes */}
              <Route path="/ru">
                <Route index element={<Home />} />
                <Route path="o-nas">
                  <Route index element={<About type="about" />} />
                  <Route path="kompaniya" element={<About type="company" />} />
                  <Route path="komanda" element={<About type="team" />} />
                  <Route
                    path="dokumenty"
                    element={<About type="documents" />}
                  />
                  <Route path="uslugi" element={<About type="services" />} />
                </Route>
                <Route path="kursy">
                  <Route index element={<Courses type="all" />} />
                  <Route path="tig" element={<Courses type="tig" />} />
                  <Route path="mag" element={<Courses type="mag" />} />
                  <Route path="mig" element={<Courses type="mig" />} />
                  <Route path="mma" element={<Courses type="mma" />} />
                  <Route
                    path="kvalifikaciya"
                    element={<Courses type="qualification" />}
                  />
                  <Route
                    path="kompanii"
                    element={<Courses type="companies" />}
                  />
                  <Route
                    path="bezrabotnye"
                    element={<Courses type="unemployed" />}
                  />
                  <Route
                    path="kak-vybrat"
                    element={<Courses type="howToChoose" />}
                  />
                </Route>
                <Route path="sertifikaciya" element={<Sertification />} />
                <Route path="dlya-uchashchikhsya" element={<Learner />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="kontakty" element={<Contacts />} />
                <Route path="karta" element={<Sitemap />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
