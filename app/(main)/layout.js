import Footer from '../_template/_components/Footer';
import Header from '../_template/_components/Header';

const MainLayout = ({ children }) => {
    return (
        <div className="">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;
