import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import MyModal from '../components/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function Product() {
    const inputStyle = "from-control w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    const [product, setProduct] = useState({})

    const handleSave = async () => {
        
    }
  return (
    <>
      <Breadcrumb pageName="Product" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <button
          className="btn cursor-pointer rounded bg-primary py-1 px-2 m-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
          onClick={() => document.getElementById('modalProduct').showModal()}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add product
        </button>

        <MyModal id="modalProduct" title="Product">
          <div>
            <div>Product name</div>
            <input type="text" className={inputStyle} onClick={e => setProduct({ ...product, name : e.target.value })}/>
          </div>
          <div className="mt-3">
            <div>Cost</div>
            <input type="number" className={inputStyle} onClick={e => setProduct({ ...product, cost : e.target.value })}/>
          </div>
          <div className="mt-3">
            <div>Price</div>
            <input type="number" className={inputStyle} onClick={e => setProduct({ ...product, price : e.target.value })}/>
          </div>
          <div className="mt-3">
            <div>Product picture</div>
            <input type="file" className={inputStyle} />
          </div>
          <div className="mt-3">
            <button className="btn cursor-pointer rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
            onClick={handleSave}>
              <FontAwesomeIcon icon={faCheck} />
              <span className='text-lg'>save</span>
            </button>
          </div>
        </MyModal>
      </div>
    </>
  );
}
