import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';
import dayjs from 'dayjs';
import MyModal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faSackDollar, faTruck,faTimes } from '@fortawesome/free-solid-svg-icons';

const BillSale = () => {
  const [billSales, setBillSales] = useState([]);
  const [billSaleDetails, setBillSaleDetails] = useState([]);
  const [sumPrice, setSumPrice] = useState(0);

  const tbodyStyle = `px-4 py-2 text-black dark:text-white text-center border-r border-gray-300 dark:border-strokedark `;
  const theadStyle =
    'text-black dark:text-white text-center border-r border-gray-300 dark:border-strokedark';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.apiPath + '/api/sale/list',
        config.headers(),
      );

      if (res.data.results !== undefined) {
        setBillSales(res.data.results);
      }
    } catch (error) {
      TailwindSwal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const openModalInfo = async (item) => {
    try {
      const res = await axios.get(
        config.apiPath + '/api/sale/billInfo/' + item.id,
        config.headers(),
      );
      if (res.data.results !== undefined) {
        setBillSaleDetails(res.data.results);

        let mySumPrice = 0;
        for (let i = 0; i < res.data.results.length; i++) {
          mySumPrice += parseInt(res.data.results[i].price);
        }

        setSumPrice(mySumPrice);
      }
    } catch (error) {
      TailwindSwal.fire({
        target: document.getElementById('modalInfo'),
        title: 'error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const handlePay = async (item) => {
    try {
      const button = await TailwindSwal.fire({
        title: 'Comfire transection',
        text: 'Payed and check imformation?',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.get(
          config.apiPath + '/api/sale/updateStatusToPay/' + item.id,
          config.headers(),
        );

        if (res.data.message === 'success') {
          TailwindSwal.fire({
            title: 'Save',
            test: 'Saved information transaction',
            icon: 'success',
            timer: 1000,
          });

          fetchData();
        }
      }
    } catch (error) {
      TailwindSwal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const handleSend = async (item) => {
    try {
      const button = await TailwindSwal.fire({
        title: 'Comfirm delivery product',
        text: 'Are you confirm delivery product to customer?',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      });

      if (button.isConfirmed) {
        const res = await axios.get(
          config.apiPath + '/api/sale/updateStatusToSend/' + item.id,
          config.headers(),
        );
        
        if (res.data.message === 'success') {
          TailwindSwal.fire({
            title: 'success',
            text: 'Saved information delivery',
            icon: 'success',
          });
          fetchData();
        }
      }
    } catch (error) {
      TailwindSwal.fire({
        title: 'error',
        text: error.massage,
        icon: 'error',
      });
    }
  };

  const handleCancel = async (item) => {
    try {
      const button = await TailwindSwal.fire({
        title: 'Cancel this bill',
        text: 'Are you confirm cancel this bill?',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      });


      if (button.isConfirmed) {
        const res = await axios.get(
          config.apiPath + '/api/sale/updateStatusToCancel/' + item.id,
          config.headers(),
        );
        if (res.data.message === 'success') {
          console.log('Success');
          
          TailwindSwal.fire({
            title: 'Save',
            text: 'Saved cancel bill status',
            icon: 'success',
            timer: 1000,
          });

          fetchData();
        }
      }
    } catch (error) {
      TailwindSwal.fire({
        title: 'Error',
        text: error.mesaage,
        icon: 'error',
      });
    }
  };

  const displayStatusText = (item) => {
    const baseStyles =
      "text-white text-center py-2 px-4 rounded-xl shadow-md inline-block";
    switch (item.status) {
      case "wait":
        return (
          <div className={`${baseStyles} bg-pink-400`}>
            Wait check
          </div>
        );
      case "payed":
        return (
          <div className={`${baseStyles} bg-info`}>
            Payed
          </div>
        );
      case "delivered":
        return (
          <div className={`${baseStyles} bg-success`}>
            Delivered
          </div>
        );
      case "canceled":
        return (
          <div className={`${baseStyles} bg-red-500`}>
            Cancel Bill
          </div>
        );
      default:
        return null;
    }
  };
  

  const TailwindSwal = Swal.mixin({
    customClass: {
      container: 'dark:bg-gray-800 bg-gray-100',
      popup:
        'rounded-lg shadow-lg bg-white text-gray-800 dark:bg-gray-900 dark:text-white p-6',
      title: 'text-xl font-bold dark:text-primary text-primary  ',
      htmlContainer: 'dark:text-gray-300 text-gray-600',
      confirmButton:
        'dark:bg-gray-600 dark:hover:bg-gray-700 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mx-2',
      cancelButton:
        'dark:bg-gray-600 dark:hover:bg-gray-700 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mx-2',
    },
    buttonsStyling: false,
  });

  return (
    <>
      <Breadcrumb pageName="Sale report" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="container-products overflow-x-auto">
          <table className="table-auto w-full text-left ">
            <thead>
              <tr className="bg-gray-200 dark:bg-boxdark h-20">
                <th className={`text-xl w-2/12 ${theadStyle}`}>
                  Customer Name
                </th>
                <th className={`text-xl w-1/12 ${theadStyle}`}>Phone</th>
                <th className={`text-xl w-3/12 ${theadStyle}`}>Address</th>
                <th className={`text-xl w-1/12 ${theadStyle}`}>Pay Date</th>
                <th className={`text-xl w-1/12 ${theadStyle}`}>Pay Time</th>
                <th className={`text-xl w-1/12 ${theadStyle}`}>Status</th>
                <th className="w-4/12"></th>
              </tr>
            </thead>
            <tbody>
              {billSales.length > 0 ? (
                billSales.map((item, index) => {
                  return (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0
                          ? 'bg-gray-100 dark:bg-gray-600 '
                          : 'bg-gray-200 dark:bg-gray-700 '
                      }`}
                    >
                      <td className={tbodyStyle}>{item.customerName}</td>
                      <td className={tbodyStyle}>{item.customerPhone}</td>
                      <td className={tbodyStyle}>{item.customerAddress}</td>
                      <td className={tbodyStyle}>
                        {dayjs(item.payDate).format('DD/MM/YYYY')}
                      </td>
                      <td className={tbodyStyle}>{item.payTime}</td>
                      <td className={tbodyStyle}>{displayStatusText(item)}</td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            onClick={(e) => {
                              document.getElementById('modalInfo').showModal();
                              openModalInfo(item);
                            }}
                            className="btn bg-pink-400 text-white flex items-center gap-2 px-4 py-2 rounded-md shadow-md hover:bg-pink-600 w-full sm:w-auto border-0"
                          >
                            <FontAwesomeIcon icon={faRectangleList} />
                            <span>List</span>
                          </button>
                          <button
                            className="btn btn-info text-white flex items-center gap-2 px-4 py-2 rounded-md shadow-md hover:bg-info-dark w-full sm:w-auto"
                            onClick={() => handlePay(item)}
                          >
                            <FontAwesomeIcon icon={faSackDollar} />
                            <span>Payed</span>
                          </button>
                          <button
                            className="btn btn-success text-white flex items-center gap-2 px-4 py-2 rounded-md shadow-md hover:bg-success-dark w-full sm:w-auto"
                            onClick={() => handleSend(item)}
                          >
                            <FontAwesomeIcon icon={faTruck} />
                            <span>Delivered</span>
                          </button>
                          <button
                            onClick={() => handleCancel(item)}
                            className="btn bg-red-500 text-white flex items-center gap-2 px-4 py-2 rounded-md shadow-md hover:bg-red-600 w-full sm:w-auto border-0"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <MyModal id="modalInfo" title="Bill Info">
        <table className="mt-3 min-w-full border border-gray-200 rounded-lg dark:border-strokedark">
          <thead className="bg-gray-100 dark:bg-boxdark dark:border-strokedark ">
            <tr>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                List
              </th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                Price
              </th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-white">
                Qty.
              </th>
            </tr>
          </thead>
          <tbody>
            {billSaleDetails.length > 0 ? (
              billSaleDetails.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:bg-gray-700 dark:border-strokedark"
                >
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                    {item.Product.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                    {parseInt(item.price).toLocaleString('th-TH')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                    1
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-4 text-center text-sm text-gray-500 italic"
                >
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="container-sum text-center bg-gray-800 text-white py-4 rounded-lg shadow-md">
          <p className="text-xl font-semibold">
            Total price: {sumPrice.toLocaleString('th-TH')} THB.
          </p>
        </div>
      </MyModal>
    </>
  );
};

export default BillSale;
