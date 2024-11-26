import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import MyModal from '../components/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare,faTrashCan } from '@fortawesome/free-regular-svg-icons';

export default function Product() {
  const inputStyle =
    'from-control w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary';

  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);

  const handleSave = async () => {
    try {
      product.img = '';
      product.price = parseInt(product.price);
      product.cost = parseInt(product.cost);

      const res = await axios.post(
        config.apiPath + '/product/create',
        product,
        config.headers(),
      );

      if (res.data.message === 'success') {
        Swal.fire({
          target: document.getElementById('modalProduct'),
          title: 'save',
          text: 'success',
          icon: 'success',
          timer: 2000,
        });
        document.getElementById('modalProduct_btnClose').click();
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        target: document.getElementById('modalProduct'),
        title: 'error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const clearForm = () => {
    setProduct({
      name: '',
      price: '',
      cost: '',
    });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.apiPath + '/product/list',
        config.headers(),
      );

      if (res.data.results !== undefined) {
        setProducts(res.data.results);
      }
    } catch (error) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Product" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <button
          className="btn cursor-pointer rounded bg-primary py-1 px-2 m-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
          onClick={() => {
            document.getElementById('modalProduct').showModal();
            clearForm();
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add product
        </button>

        <div className="container-products overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className='text-xl w-6/12 text-black'>Name</th>
                <th className='text-xl w-1/12 text-black text-center'>Cost</th>
                <th className='text-xl w-1/12 text-black text-center'>Price</th>
                <th className='w-1/12'></th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map(item => 
                <tr className='hover:bg-primary hover:text-white text-lg'>
                  <td>{item.name}</td>
                  <td className='text-center'>{item.cost}</td>
                  <td className='text-center'>{item.price}</td>
                  <td>
                    <button className="btn btn-info mx-1"><FontAwesomeIcon icon={faPenToSquare} /></button>
                    <button className='btn btn-error mx-1'><FontAwesomeIcon icon={faTrashCan} /></button>
                  </td>
                </tr>
              ) : <></>}
            </tbody>
          </table>
        </div>

        <MyModal id="modalProduct" title="Product">
          <div>
            <div>Product name</div>
            <input
              value={product.name}
              type="text"
              className={inputStyle}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <div>Cost</div>
            <input
              value={product.cost}
              type="number"
              className={inputStyle}
              onChange={(e) => setProduct({ ...product, cost: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <div>Price</div>
            <input
              value={product.price}
              type="number"
              className={inputStyle}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>
          <div className="mt-3">
            <div>Product picture</div>
            <input type="file" className={inputStyle} />
          </div>
          <div className="mt-3">
            <button
              className="btn cursor-pointer rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
              onClick={handleSave}
            >
              <FontAwesomeIcon icon={faCheck} />
              <span className="text-lg">save</span>
            </button>
          </div>
        </MyModal>
      </div>
    </>
  );
}
