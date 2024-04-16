export const confirmOrderUpdateEmail = async (customerEmail, customerName, orderNumber, orderDate, productsData) => {
    try {
      const emailRes = await sendEmail(
        customerEmail,
        confirmOrder(orderNumber, customerName, orderDate, productsData),
        "We have got your order"
      );
  
      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.log("Error", error);
      console.log("Error message :", error.message);
      return {
        success: false,
        message: "Something went wrong...",
      };
    }
  };