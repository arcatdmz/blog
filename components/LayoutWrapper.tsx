import Footer from "./Footer";
import Header from "./Header";
import SectionContainer from "./SectionContainer";

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <Header />
      <div className="pusher" id="pusher">
        <main id="body">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;
