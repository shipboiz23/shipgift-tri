import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import PropTypes from 'prop-types';

const PayPalCheckoutButton = (props) => {
    const { product } = props;
    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);

    const handleApprove = (orderId) => {
        // Call backend function to fullfil order

        // If the response is successful
        setPaidFor(true);

        // Refresh the user's account or subscription status

        // If the response is error
        // setError("Your payment was processed successfully. However, we're unable to fulfil your purchase. Please contact us at (#Please Enter Contact Email Address) for further assistance.");
    }
     
    if (paidFor) {
        // Display success message, model or redirect user to success page
        alert("Thank you for your purchase!");
    }

    if (error) {
        // Display error message, modal or redirect user to error page
        alert(error);
    }

  return (
    <>
        <PayPalButtons 
            className="cursor-pointer border-none rounded-md w-full h-[45px] mt-5 transition-all duration-300 ease-in-out block hover:contrast-50 hover:scale-105 active:scale-95 active:translate-y-0 "
            style={{
                color: 'gold',
                layout: 'horizontal',
                height: 45,
                tagline: false,
                shape: 'rect'
            }}
            onClick={(data, actions) => {
                //Validate on button click, client or server side
                const hasAlreadyBoughtVoucher = false;

                if (hasAlreadyBoughtVoucher) {
                    setError(
                        "You already bought this course. Go to your account to view your list of courses."
                    );

                    return actions.reject();
                } else {
                    return actions.resolve();
                }    
            }}
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            description: product.description,
                            amount: {
                                value: product.price,
                            }
                        }
                    ]
                });
            }}
            onApprove={async(data, actions) => {
                const order = await actions.order.capture();
                console.log("order", order);

                handleApprove(data.orderID);
            }}
            onCancel={() => {
                //Display cancel message, modal or redirect user to cancel page or back to cart
            }}
            onError={(err) => {
                setError(err)
                console.error("Paypal Checkout onError", err);
            }}
        />
    </>
  )
}

PayPalCheckoutButton.propTypes = {
    product: PropTypes.shape({
        description: PropTypes.string,
        price: PropTypes.number,
    })
}

export default PayPalCheckoutButton