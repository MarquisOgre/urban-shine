const Footer = () => {
  return (
    <>
      {/* Spacer so fixed footer never covers page content */}
      <div className="h-12" aria-hidden="true" />
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-300 text-xs sm:text-sm">
            © 2026 UltraShine. Crafted with ❤️ by Dexorzo Creations.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
