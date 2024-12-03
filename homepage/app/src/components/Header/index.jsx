import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="https://img.freepik.com/free-vector/free-vector-cat-head-simple-mascot-logo-design_779267-1581.jpg?t=st=1733213230~exp=1733216830~hmac=8311f628a139d68a32dd35d2aa3ee559ce14cb4b7d5b1268c41cf353da476c47&w=996"
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">Store</span>
            </a>
          </div>

          {/* Search */}
          <div className='border border-solid border-2 rounded-xl'>
            <form action="">
              <div>
                <input type="text" />
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </form>
          </div>
          {/* Search */}

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