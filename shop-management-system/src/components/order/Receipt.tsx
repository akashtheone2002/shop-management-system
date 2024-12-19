"use client"
import { ITransaction } from "@/types/apiModels/apiModels";

interface ReceiptProps {
    transaction: ITransaction;
    taxRates: { Taxes: number; Shipping: number };
  }
export const Receipt: React.FC<ReceiptProps> = ({ transaction, taxRates }) => {
    // Derive Subtotal and Taxes from the Total Price
    const total = transaction.totalPrice || 0;
    const taxMultiplier = 1 + taxRates.Taxes + taxRates.Shipping;
    const subtotal = total / taxMultiplier;
    const Taxes = subtotal * taxRates.Taxes;
    const Shipping = subtotal * taxRates.Shipping;

    const printBill = () => {
        // Open a new window for the print
        const printWindow = window.open('', '_blank');
        const receiptElement = document.getElementById('receipt');

        if (printWindow) {
            const receiptHTML = receiptElement?.outerHTML;
          // Copy the receipt content to the new window
          printWindow.document.write(`
            <html>
              <head>
                <title>Receipt</title>
              </head>
              <body>
                ${receiptHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          // Print the new window content
          printWindow.print();
        }
      };
      
    return (
        <>
      <div id="receipt">
        <style>
          {`
            body {
                margin: 0;
                padding: 0;
                font-family: 'PT Sans', sans-serif;
            }
            @page {
                size: 2.8in 11in;
                margin-top: 0cm;
                margin-left: 0cm;
                margin-right: 0cm;
            }
            table {
                width: 100%;
            }
            tr {
                width: 100%;
            }
            h1 {
                text-align: center;
                vertical-align: middle;
            }
            #logo {
                width: 60%;
                text-align: center;
                -webkit-align-content: center;
                align-content: center;
                padding: 5px;
                margin: 2px;
                display: block;
                margin: 0 auto;
            }
            header {
                width: 100%;
                text-align: center;
                -webkit-align-content: center;
                align-content: center;
                vertical-align: middle;
            }
            .items thead {
                text-align: center;
            }
            .center-align {
                text-align: center;
            }
            .bill-details td {
                font-size: 12px;
            }
            .receipt {
                font-size: medium;
            }
            .items .heading {
                font-size: 12.5px;
                text-transform: uppercase;
                border-top: 1px solid black;
                margin-bottom: 4px;
                border-bottom: 1px solid black;
                vertical-align: middle;
            }
            .items thead tr th:first-child,
            .items tbody tr td:first-child {
                width: 47%;
                min-width: 47%;
                max-width: 47%;
                word-break: break-all;
                text-align: left;
            }
            .items td {
                font-size: 12px;
                text-align: right;
                vertical-align: bottom;
            }
            .price::before {
                content: "\\20B9";
                font-family: Arial;
                text-align: right;
            }
            .sum-up {
                text-align: right !important;
            }
            .total {
                font-size: 13px;
                border-top: 1px dashed black !important;
                border-bottom: 1px dashed black !important;
            }
            .total.text,
            .total.price {
                text-align: right;
            }
            .total.price::before {
                content: "\\20B9";
            }
            .line {
                border-top: 1px solid black !important;
            }
            .heading.rate {
                width: 20%;
            }
            .heading.amount {
                width: 25%;
            }
            .heading.qty {
                width: 5%;
            }
            p {
                padding: 1px;
                margin: 0;
            }
            section,
            footer {
                font-size: 12px;
            }
          `}
        </style>
        <header>
          <div id="logo">
            <img src={process.env.SHOP_ICON} alt="Logo" />
          </div>
        </header>
        <p>GST Number : 4910487129047124</p>
        <table className="bill-details">
          <tbody>
            <tr>
              <td>Date : {new Date(transaction.boughtOn || '').toLocaleDateString()}</td>
              <td>Time : {new Date(transaction.boughtOn || '').toLocaleTimeString()}</td>
            </tr>
            <tr>
              <td>Customer: {transaction.customer?.name}</td>
              <td>Placed By: {transaction.user?.name}</td>
            </tr>
            <tr>
              <th className="center-align" colSpan={2}>
                <span className="receipt">Original Receipt</span>
              </th>
            </tr>
          </tbody>
        </table>
        <table className="items">
          <thead>
            <tr>
              <th className="heading name">Item</th>
              <th className="heading qty">Qty</th>
              <th className="heading rate">Rate</th>
              <th className="heading amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transaction.orders?.map((order, index) => (
              <tr key={index}>
                <td>{order.product?.name}</td>
                <td>{order.quantity}</td>
                <td className="price">{order.product?.price?.toFixed(2)}</td>
                <td className="price">
                  {parseFloat((order?.price || 0).toFixed(2))}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="sum-up line">
                Subtotal
              </td>
              <td className="line price">{subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="sum-up">
                Taxes
              </td>
              <td className="price">{Taxes.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="sum-up">
                Shipping
              </td>
              <td className="price">{Shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <th colSpan={3} className="total text">
                Total
              </th>
              <th className="total price">{total.toFixed(2)}</th>
            </tr>
          </tbody>
        </table>
        <section>
          <p>Paid by : <span>CASH</span></p>
          <p style={{ textAlign: 'center' }}>Thank you for your visit!</p>
        </section>
        <footer style={{ textAlign: 'center' }}>
          <p>{process.env.SHOP_NAME}</p>
          <p>www.{process.env.SHOP_NAME}.in</p>
        </footer>
      </div>
      <button onClick={printBill}>Print Bill</button>
      </>
    );
  };