// this component is simply to manage the current context of cart data and provide that context to all components that want access to it.
import CartContext from "./cart-context"
import { useReducer } from "react"

//reducer function can put outside of component because no interval values of the CartProvider component is needed in reducer.
//receive a state object and an action automatically by React.

// The action is dispatched by dispatchCartAction inside the Component
// state is simply the last state snapshotof the state managed by the reducer func.
// And then as part of the reducer function,
// you have to return a new state snapshot.
//at the begining, the state in cartReducer func is the defaultCartState

//initial value of the useReducer func
const defaultCartState = {
  items: [],
  totalAmount: 0,
}
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    //     concat here adds adds a new item to an array
    // but unlike push, it doesn't edit the existing array
    // but return a new array.
    //add the new item
    const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount
    // findIndex returns the index of the first array element that matches the condition
    const existingCartItemIndex = state.items.findIndex((item) => item.id === action.item.id)
    //retreive the existing cart item
    const existingCartItem = state.items[existingCartItemIndex]
    let updatedItem
    let updatedItems
    // if there is an existingCartItm
    if (existingCartItem) {
      //update the cartItem
      updatedItem = {
        //copy the properties of existingCartItem, and update the amount
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      }
      // copy the existing items of the last state snapshot to a new array updatedItems, so can update the updatedItem without chaning the old array
      updatedItems = [...state.items]
      updatedItems[existingCartItemIndex] = updatedItem
    } else {
      updatedItem = { ...action.item }
      updatedItems = state.items.concat(updatedItem)
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    }
  }
  if (action.type === "REMOVE") {
    const existingCartIndex = 
  }
  // if action.type != add or remove , return defaultCartState
  return defaultCartState
}

const CartProvider = (props) => {
  //初始化cartstate作为初始值
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState)
  //called by MealItem.js
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item })
  }
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id })
  }
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    //called in MealItem.js
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  }
  return <CartContext.Provider value={cartContext}>{props.children}</CartContext.Provider>
}
export default CartProvider
