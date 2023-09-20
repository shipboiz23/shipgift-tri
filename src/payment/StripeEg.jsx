import { useEffect, useState } from 'react'

import gift  from './../assets/gift_1.jpg';
import { PaystackButton } from 'react-paystack';
import PayPalCheckoutButton from '../components/PayPalCheckoutButton';

// NOTE: The Form's a requirement by Paystack. In addition, once you submit the form the state is updated accordingly.

const StripeEg = () => {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [currency, setCurrency] = useState("KES")
    const [paystackPK, setPaystackPK] = useState("")

    const itemName = 'Voucher';
    const itemPrice = 7000;

    const [quantity, setQuantity] = useState(1);
    const [finalAmount, setFinalAmount] = useState(itemPrice);

    // Pulling Paystack's Public Key from the server
    useEffect(() => {
        fetch("https://shipgift-tri-api.onrender.com/config").then(async (r) => {
          const { paystackKey } = await r.json();

          setPaystackPK(paystackKey)
        });
    }, [])

    //Incrementing
    const increment = () => {
        setQuantity(quantity + 1);
        setFinalAmount(finalAmount + itemPrice);
    }

    //Decrementing
    const decrement = () => {
        if (quantity <= 1) {
            setQuantity(1);
            setFinalAmount(itemPrice);
        }
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setFinalAmount(finalAmount - itemPrice);
        }
    }

    const resetForm = () => {
        setEmail('');
        setName('');
        setPhone('');
    };

    // Setting up Paystacks checkout
    const componentProps = {
        email,
        amount: (finalAmount * 100),
        currency,
        metadata: {
            name,
            phone,
        },
        publicKey: paystackPK,
        text: 'Paystack',
        onSuccess: ({ reference }) => {
            alert(
                `Your purchase was successful! Transaction reference: ${reference}`
            );
            resetForm();
            
            window.location.reload();
        },
        onClose: () => alert("Request Failed"),
    }

    // Setting up Stripes checkout
    const stripeCheckout = () => {
        fetch("https://shipgift-tri-api.onrender.com/create-checkout-session", {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          mode:"cors",
          body: JSON.stringify({
            items: [
              {id:1, quantity: quantity, price: itemPrice, name: itemName}
            ]
          })
        })
        .then(res => {
          if (res.ok) return res.json()
          return res.json().then(json => Promise.reject(json))
        })
        .then(({url})=>{
          window.location = url
        })
        .catch(e => {
          console.log(e.error)
        })
    }

    // TODO: Rather than hardcoding the Exchange rate, I should employ exchange rates API.

    const product = {
        description: itemName,
        price: finalAmount,
    };

    return (
        <>
            <div className="text-center tracking-widest">
                <div className="flex flex-row m-[5%_auto] w-[635px] h-[600px] bg-[#f5d699] rounded-lg shadow-2xl">
                    <div className="w-1/2 h-[600px] bg-transparent rounded-lg relative">
                        <div className="absolute top-0 bottom-0 left-0 right-0 opacity-20 bg-[#21130d] overflow-hidden z-10"></div>
                        <img
                            className="w-full rounded-tl-lg h-[430px] object-cover"
                            src={gift}
                            alt="product"
                        />
                        <div className="absolute z-20 bg-[#f5d699] shadow-md border-none p-4 right-3 rounded-md bottom-40 ml-[20px] text-[#472011]">
                            <p className="text-[22px]">Gift Voucher</p>
                            <p className="font-extrabold">KES {itemPrice}</p>

                            <small className='mt-6 mb-2 text-base font-semibold'>
                                Add Quantity
                            </small>
                            <div className='flex rounded-lg bg-[#472011] text-white justify-center items-center mb-5'>
                                <span
                                    onClick={decrement}
                                    className="select-none w-auto px-4 py-2 text-5xl text-[#472011] bg-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 active:translate-y-0"
                                >
                                    -
                                </span>
                                <span className='w-auto px-4 py-2 text-[22px] font-semibold'>
                                    {quantity}
                                </span>
                                <span
                                    onClick={increment}
                                    className='select-none w-auto px-4 py-2 text-5xl text-[#472011] bg-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 active:translate-y-0'
                                >
                                    +
                                </span>
                            </div>

                            <div className='my-6 font-semibold text-lg'>
                                Amount to be paid:
                                <span className='text-[#3f1c0f] text-3xl font-bold pl-3'>
                                   KES {finalAmount}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#472011] rounded-tr-lg rounded-br-lg flex flex-col justify-center h-[600px] w-1/2 checkout">
                        <div className="p-[20px_20px] checkout-form">
                            <div className="flex flex-col mb-[20px] checkout-field">
                                <label
                                    className="text-left text-white text-[10px] mb-[5px] uppercase tracking-widest"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="bg-[#e6c685] placeholder:text-sm placeholder:text-gray-300 border-[1px] border-solid border-white focus:border-hidden focus:bg-white rounded-[5px] pl-2 text-black h-[35px]"
                                    id="name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-[20px] checkout-field">
                                <label
                                    className="text-left text-white text-[10px] mb-[5px] uppercase tracking-widest"
                                >
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="bg-[#e6c685] placeholder:text-sm placeholder:text-gray-300 border-[1px] border-solid border-white focus:border-hidden focus:bg-white rounded-[5px] pl-2 text-black h-[35px]"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-[20px] checkout-field">
                                <label
                                    className="text-left text-white text-[10px] mb-[5px] uppercase tracking-widest"
                                >
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="bg-[#e6c685] placeholder:text-sm placeholder:text-gray-300 border-[1px] border-solid border-white focus:border-hidden focus:bg-white rounded-[5px] pl-2 text-black h-[35px]"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-[20px] checkout-field">
                                <label
                                    className="text-left text-white text-[10px] mb-[5px] uppercase tracking-widest"
                                >
                                    Currency
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="bg-[#e6c685] placeholder:text-sm placeholder:text-gray-300 border-[1px] border-solid border-white focus:border-hidden focus:bg-white rounded-[5px] pl-2 text-black h-[35px]"
                                    onChange={(e) => setCurrency(e.target.value)}
                                />
                            </div>

                            {/* PAYMENT OPTIONS */}
                            <PaystackButton
                                className="cursor-pointer text-center text-[12px] tracking-widest uppercase bg-green-600 font-bold text-white border-none rounded-md w-full h-[45px] mt-[40px] transition-all duration-300 ease-in-out block hover:contrast-50 hover:scale-105 active:scale-95 active:translate-y-0 paystack-button"
                                {...componentProps}
                            />

                            <div className='paypal-button'>
                                <PayPalCheckoutButton product={product} />
                            </div>

                            <button
                                onClick={stripeCheckout}
                                className='bg-[#635BFF] rounded-md text-white border-0 p-[12px_16px] w-full mt-5 font-semibold cursor-pointer transition-all duration-300 ease-in-out block hover:contrast-50 hover:scale-105 active:scale-95 active:translate-y-0'
                            >
                                Stripe Checkout
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export default StripeEg