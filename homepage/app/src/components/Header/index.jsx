

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="/placeholder.svg"
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">Store</span>
            </a>
          </div>
          {/* Cart */}
          <div className="flex items-center space-x-4">
          <button className="btn btn-primary">Buy Now
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                0
              </span>
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;