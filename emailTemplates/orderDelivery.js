const orderDelivery = (
  customerName,
  orderNumber,
  trackingLink,
  deliveryAddress,
  description
) => {
  return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order Delivery Ready</title>
          <style>
            @media screen and (max-width: 600px) {
              .button-container {
                display: block;
              }
            }
          </style>
        </head>
        <body>
          <section
            style="
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
            "
          >
            <div style="text-align: center; display: flex; justify-content: center">
              <img
                src="https://res.cloudinary.com/dtb0waros/image/upload/v1713083989/brand-logo_ka5idp.png"
                alt="brand-logo"
                style="max-width: 200px; height: auto"
              />
            </div>
            <h1 style="text-align: center; font-size: 24px; font-weight: 400; margin: 20px 0">
              <span style="color: #5945E3;">
                Your order <strong>#${orderNumber}</strong><br />is on its way
              </span>😊<span style="color: #5945E3;">.</span>
            </h1>
            <div
              style="
                border: 1px solid #d4ceff;
                border-radius: 10px;
                background: white;
                padding: 20px;
              "
            >
              <p style="font-size: 16px; color: #24104f; line-height: 1.5">
                Hi ${customerName}, <br /><br />
                We have great news! Your order <strong>#${orderNumber}</strong> has left our warehouse and is
                on its way to your address. You can also keep track of your order
                <a href="${trackingLink}" style="text-decoration: underline; color: #24104f">here</a>.<br /><br />
                Thank you for shopping at
                <a href="https://your-chelo-shop.com" style="text-decoration: underline; color: #24104f">Chelo</a>.
              </p>
              <div
                style="
                  border-top: 1px solid rgba(182, 182, 182, 0.3);
                  padding: 20px 0;
                  margin-top: 20px;
                "
              >
                <h2 style="font-size: 20px; font-weight: bold; color: #24104f">
                  Delivery Address:
                </h2>
                <p style="font-size: 16px; color: black; margin-top: 10px">
                  <strong>${customerName}</strong><br />
                  <strong>${deliveryAddress.contactNumber}</strong>
                </p>
                <p style="font-size: 16px; color: #24104f; margin-top: 10px">
                  ${deliveryAddress.addressLine1},<br />${deliveryAddress.addressLine2},<br />${deliveryAddress.streetCode}
                </p>
              </div>

              <p style="font-size: 16px; color: #24104f; margin-top: 10px">
                  <b>Description:</b><br/>
                  ${description}
                </p>
              
            </div>
          </section>
        </body>
      </html>`;
};

export { orderDelivery };
