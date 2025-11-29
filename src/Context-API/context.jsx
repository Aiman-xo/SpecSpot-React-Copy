import React, { useEffect, useState } from 'react'
import { createContext } from 'react'

export const searchContext = createContext();

function Context({ children }) {
    let [search, setSearch] = useState("");
    let [user, setUser] = useState('');
    let [focus, setFocus] = useState(false);
    let [cartlength, setCartLength] = useState(0);
    let [wishlistLength, setWishlistLength] = useState(0);
    let [flag, setFlag] = useState(false);

    // let [addtocart, setAddtocart] = useState(JSON.parse(localStorage.getItem("cartValue") || []));


    // useEffect(() => {
    //     localStorage.setItem("cartValue", JSON.stringify(addtocart))
    // }, [addtocart])

    // function isAuth() {
    //     localStorage.getItem("userId");
    // }

    // useEffect(() => {
    //     if (!user) {
    //         isAuth()
    //     }
    // }, [])
    // console.log('USER', user)
    return (
        <div>
            <searchContext.Provider value={{ search, setSearch, user, setUser, focus, setFocus, flag, setFlag, cartlength, setCartLength, wishlistLength, setWishlistLength }}>
                {children}
            </searchContext.Provider>
        </div>
    )
}

export default Context

