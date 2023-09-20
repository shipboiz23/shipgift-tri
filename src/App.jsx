import { BrowserRouter, Routes, Route } from "react-router-dom"
import StripeEg from "./payment/StripeEg"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useEffect, useState } from "react"
import Success from "./payment/Success"
import Cancel from "./payment/Cancel"

// TODO: Replace the `clientId: "test"` with the `paypalPK`, which is the PayPal Public Key

function App() {
    const [paypalPK, setPayPalPK] = useState("")

    useEffect(() => {
        fetch("https://shipgift-tri-api.onrender.com/config").then(async (r) => {
            const { paypalKey } = await r.json();

            setPayPalPK(paypalKey)
        });
    }, [])


    return (
        <>
            <PayPalScriptProvider options={{ clientId: "test" }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<StripeEg />} />
                        <Route path="/success" element={<Success />} />
                        <Route path="/cancel" element={<Cancel />} />
                    </Routes>
                </BrowserRouter>
            </PayPalScriptProvider>
        </>
    )
}

export default App
