const confirmOrder = (orderNumber, customerName, orderDate, productsData) => {
  const productItems = productsData.map(({ productName, productQuantity, productSize, productDetails, productPrice, productImage }) => {
    return `
      <tr style="border-bottom: 1px solid #b6b6b6; font-size: 14px; color: #24104f;">
        <td style="padding: 10px; text-align: left; display: flex; align-items: center;">
          <span>${productQuantity}</span>
          <span style="margin-left: 20px;">
            <img src="${productImage}" alt="product" style="width: 50px; height: auto;">
          </span>
        </td>
        <td style="padding: 10px; text-align: left;">${productSize}</td>
        <td style="padding: 10px; text-align: left;">${productDetails}</td>
        <td style="padding: 10px; text-align: right;">R${productQuantity * parseInt(productPrice)}</td>
      </tr>
    `;
  }).join('');
  const totalAmount = productsData.reduce((total, { productQuantity, productPrice }) => total + (productQuantity * parseInt(productPrice)), 0);

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation</title>
      </head>
      <body>
        <section style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; display: flex; justify-content: center">
            <img src="https://res.cloudinary.com/dtb0waros/image/upload/v1713083989/brand-logo_ka5idp.png" alt="brand-logo" style="max-width: 200px; height: auto">
          </div>
          <h1 style="text-align: center; font-size: 24px; margin: 20px 0; background: linear-gradient(94.29deg, #24104f 7.3%, #6551f3 119.44%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Your order <strong>${orderNumber}</strong><br />has been received.
          </h1>
          <div style="border: 1px solid #d4ceff; border-radius: 10px; background: white; padding: 20px;">
            <p style="font-size: 16px; color: #24104f; line-height: 1.5">
              Hi ${customerName}, <br /><br />
              Thank you for shopping with Chelo. We are preparing your order.<br />
              We will email you whenever the status of your order changes.
            </p>
            <div style="margin-top: 20px">
              <ul>
                <li style="display: flex; align-items: center">
                  <div>
                    <p style="font-weight: normal; font-size: 14px; color: black">
                      Order No:
                    </p>
                    <p style="font-weight: normal; font-size: 14px; color: black">
                      Order date: 
                    </p>
                  </div>
                  <div style="margin-left: 20px">
                    <p style="font-weight: bold; font-size: 14px; color: black">
                    ${orderNumber}
                    </p>
                    <p style="font-weight: bold; font-size: 14px; color: black">
                    ${orderDate}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
    
            <div style="margin-top: 20px">
              <h2 style="font-size: 20px; font-weight: bold; color: #24104f">
                Here are details for your order. Order Details:
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="border-bottom: 1px solid #b6b6b6; background: #d9d9d9; color: #24104f; font-size: 16px; text-align: left;">
                    <th style="padding: 10px">Qty.</th>
                    <th style="padding: 10px">Size</th>
                    <th style="padding: 10px">Details</th>
                    <th style="padding: 10px; text-align: right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productItems}
                </tbody>
              </table>
              <div style="border-top: 1px solid #b6b6b6; padding: 20px; display: flex; justify-content: space-between; align-items: center; background: #d9d9d9;">
                <p style="font-size: 16px; font-weight: bold; color: #24104f">Total amount</p>
                <p style="font-size: 24px; font-weight: normal; background: linear-gradient(94.29deg, #24104f 7.3%, #6551f3 119.44%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  R${totalAmount}
                </p>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px">
            <p style="font-size: 16px; color: #24104f">
              Don't want to receive these emails anymore?
              <a href="#" style="text-decoration: underline; color: #24104f">Unsubscribe</a>
            </p>
            <p style="font-size: 16px; color: #24104f">
              <a href="#" style="text-decoration: underline; color: #24104f">Manage Your Profile</a> |
              <a href="#" style="text-decoration: underline; color: #24104f">Terms</a> |
              <a href="#" style="text-decoration: underline; color: #24104f">Code of Conduct</a> |
              <a href="#" style="text-decoration: underline; color: #24104f">Privacy Centre</a>
            </p>
          </div>
        </section>
      </body>
    </html>`;
};

export { confirmOrder };
