import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}
