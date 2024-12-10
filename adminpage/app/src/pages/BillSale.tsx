import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';
import dayjs from 'dayjs';
import MyModal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';

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
        title : 'Comfire transection',
        text : 'Payed and check imformation',
        icon : 'question',
        showCancelButton : true,
        showConfirmButton : true,
      })

      if (button.isConfirmed) {
        const res = await axios.get(config.apiPath + '/api/sale/updateStatusToPay/' + item.id, config.headers())

        if(res.data.message === 'success') {
          TailwindSwal.fire({
            title : 'Save',
            test : 'Saved information transaction',
            icon : 'success',
            timer : 1000
          })

          fetchData();
        }
      }
    } catch (error) {
      TailwindSwal.fire({
        title : 'error',
        text : error.message,
        icon : 'error'
      })
    }
  }
  const TailwindSwal = Swal.mixin({
    customClass: {
      container: 'dark:bg-gray-800 bg-gray-100',
      popup:
        'rounded-lg shadow-lg bg-white text-gray-800 dark:bg-gray-900 dark:text-white p-6',
      title: 'text-xl font-bold dark:text-primary text-primary',
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
                          ? 'bg-gray-50 dark:bg-gray-600 '
                          : 'bg-white dark:bg-gray-700 '
                      }`}
                    >
                      <td className={tbodyStyle}>{item.customerName}</td>
                      <td className={tbodyStyle}>{item.customerPhone}</td>
                      <td className={tbodyStyle}>{item.customerAddress}</td>
                      <td className={tbodyStyle}>
                        {dayjs(item.payDate).format('DD/MM/YYYY')}
                      </td>
                      <td className={tbodyStyle}>{item.payTime}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={(e) => {
                            document.getElementById('modalInfo').showModal();
                            openModalInfo(item);
                          }}
                          className="btn btn-secondary text-white mr-3"
                        >
                          <FontAwesomeIcon icon={faRectangleList} />
                          List
                        </button>
                        <button
                          className="btn btn-info text-white mr-3"
                          onClick={() => handlePay(item)}
                        >
                          <FontAwesomeIcon icon={faSackDollar} />
                          Payed
                        </button>
                        <button className="btn btn-success text-white mr-3">
                          Deliver
                        </button>
                        <button className="btn bg-red-500 text-white">
                          Cancel
                        </button>
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
