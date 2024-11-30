import { useEffect, useState, useRef } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import MyModal from '../components/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faCheck,
  faFileImport,
} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

export default function Product() {
  const inputStyle =
    'from-control w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary';

  const [product, setProduct] = useState({}); //create, update
  const [products, setProducts] = useState([]); //show all product
  const [img, setImg] = useState({}); //file for upload
  const [fileExcel, setFileExcel] = useState({}); //file for excel
  const [previewUrl, setPreviewUrl] = useState('');
  const refImg = useRef(); //for referent to image upload function and clear data when save or close modal
  const refExcel = useRef();

  // const TailwindSwal = Swal.mixin({
  //   customClass: {
  //     container: 'dark:bg-gray-800 bg-gray-100',
  //     popup:
  //       'rounded-lg shadow-lg bg-white text-gray-800 dark:bg-gray-900 dark:text-white p-6',
  //     title: 'text-xl font-bold dark:text-red-400 text-red-600',
  //     htmlContainer: 'dark:text-gray-300 text-gray-600',
  //     confirmButton:
  //       'dark:bg-gray-600 dark:hover:bg-gray-700 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mx-2',
  //     cancelButton:
  //       'dark:bg-gray-600 dark:hover:bg-gray-700 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mx-2',
  //   },
  //   buttonsStyling: false,
  // });

  const handleSave = async () => {
    try {
      product.price = parseInt(product.price);
      product.cost = parseInt(product.cost);
      product.img = await handleUpload();

      let res;
      if (product.id === undefined) {
        //if id = undefined it mean new data
        res = await axios.post(
          config.apiPath + '/product/create',
          product,
          config.headers(),
        );
      } else {
        //if id != undefined it mean have this data then update data
        res = await axios.put(
          config.apiPath + '/product/update',
          product,
          config.headers(),
        );
      }

      if (res.data.message === 'success') {
        Swal.fire({
          target: document.getElementById('modalProduct'),
          title: 'save',
          text: 'success',
          icon: 'success',
          timer: 2000,
        }).then(()=>{
          document.getElementById('modalProduct_btnClose').click();
          fetchData();
          setProduct({ ...product, id: undefined }); //clear id
          setPreviewUrl('');
          refImg.current.value = '';
        });
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

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('img', img);

      const res = await axios.post(
        config.apiPath + '/product/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('token'),
          },
        },
      );

      if (res.data.newName !== undefined) {
        return res.data.newName;
      }
    } catch (error) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
      });

      return '';
    }
  };

  const selectedFile = (inputFile) => {
    if (inputFile != undefined) {
      if (inputFile.length > 0) {
        const file = inputFile[0];
        setImg(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const clearForm = () => {
    setProduct({
      name: '',
      price: '',
      cost: '',
    });
    setImg(null);
    setPreviewUrl('');
    refImg.current.value = ''; // clear data ipput type file
  };

  const clearFormExcel = () => {
    setFileExcel(null);
    refExcel.current.value = ''; // clear data ipput type file
  };

  const selectedExcelFile = (fileInput) => {
    if (fileInput !== undefined) {
      if (fileInput.length > 0) {
        setFileExcel(fileInput[0]);
      }
    }
  };

  const handleUploadExcel = async () => {
    try {
      const formData = new FormData();
      formData.append('fileExcel', fileExcel);

      const res = await axios.post(
        config.apiPath + '/product/uploadFromExcel',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('token'),
          },
        },
      );

      if (res.data.message === 'success') {
        Swal.fire({
          target: document.getElementById('modalExcel'),
          title: 'Upload file',
          text: 'Upload file success',
          icon: 'success',
          timer: 1000,
        }).then(() => {
          document.getElementById('modalExcel_btnClose')?.click();
          clearForm()
          fetchData() // update new data after import data from excel file
        })
      }
    

    } catch (error) {
      Swal.fire({
        target: document.getElementById('modalExcel'),
        title: 'error',
        text: error.message,
        icon: 'error',
        timer: 1000,
      });
    }
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

  const showImage = (item) => {
    if (item.img !== '') {
      return (
        <img
          alt="Product-image"
          className="w-30"
          src={config.apiPath + '/uploads/' + item.img}
        />
      );
    } else {
      return (
        <img
          alt="default-image"
          className="w-30"
          src={config.apiPath + '/uploads/default-image.png'}
        />
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Product" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="button m-2">
          <button
            className="btn btn-primary text-white mr-1"
            onClick={() => {
              document.getElementById('modalProduct').showModal();
              clearForm();
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add product
          </button>

          <button
            className="btn btn-success text-white ml-1"
            onClick={() => {
              document.getElementById('modalExcel').showModal();
              clearFormExcel();
            }}
          >
            <FontAwesomeIcon icon={faFileImport} />
            Import from Excel
          </button>
        </div>

        <div className="container-products overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-xl w-3/12 text-black dark:text-white text-center">
                  Product picture
                </th>
                <th className="text-xl w-4/12 text-black dark:text-white">
                  Name
                </th>
                <th className="text-xl w-1/12 text-black dark:text-white text-center">
                  Cost
                </th>
                <th className="text-xl w-1/12 text-black dark:text-white text-center">
                  Price
                </th>
                <th className="w-2/12"></th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-primary hover:text-white text-lg"
                  >
                    <td className="flex justify-center items-center">
                      {showImage(item)}
                    </td>
                    <td>{item.name}</td>
                    <td className="text-center">{item.cost}</td>
                    <td className="text-center">{item.price}</td>
                    <td>
                      <button className="btn btn-info mx-1">
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          onClick={(e) => {
                            document.getElementById('modalProduct').showModal();
                            setProduct(item);
                          }}
                        />
                      </button>
                      <button className="btn btn-error mx-1">
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          onClick={(e) => handleRemove(item)}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>

        <MyModal id="modalProduct" title="Product">
          <div>
            <div className="text-lg ">Product name</div>
            <input
              value={product.name || ''}
              type="text"
              className={inputStyle}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <div className="text-lg ">Cost</div>
            <input
              value={product.cost || ""}
              type="number"
              className={inputStyle}
              onChange={(e) => setProduct({ ...product, cost: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <div className="text-lg">Price</div>
            <input
              value={product.price || ""}
              type="number"
              className={inputStyle}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>
          <div className="mt-3">
            <div className="text-lg mt-1">Product picture</div>
            <div>
              {previewUrl.length > 0 ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-40 w-40 object-cover mb-2"
                />
              ) : (
                <img
                  src={
                    product.img !== ''
                      ? config.apiPath + '/uploads/' + product.img
                      : config.apiPath + '/uploads/default-image.png'
                  }
                  alt="Preview"
                  className="h-40 w-40 object-cover mb-2"
                />
              )}
              {/* <div>{showImage(product)}</div> */}
              <p>Preview</p>
              <input
                type="file"
                ref={refImg}
                className={inputStyle}
                onChange={(e) => selectedFile(e.target.files)}
              />
            </div>
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

        <MyModal id="modalExcel" title="Choose file">
          <div className="my-3">Choose excel file for import data</div>
          <input
            type="file"
            className={inputStyle}
            ref={refExcel}
            onChange={(e) => selectedExcelFile(e.target.files)}
          />
          <button
            className="btn btn-primary mt-3 text-white"
            onClick={handleUploadExcel}
          >
            <FontAwesomeIcon icon={faCheck} />
            <span className="text-lg ">save</span>
          </button>
        </MyModal>
      </div>
    </>
  );
}
