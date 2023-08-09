import React, { useEffect, useState } from "react";
import axios from 'axios'
import "./App.css";

function App() {
  const [itemText, setItemText] = useState('')
  const [listItems, setListItems] = useState([])
  const [isUpdating, setIsUpdating] = useState('')
  const [updateItemText, setUpdateItemText] = useState('')

  const addItem = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.post('http://localhost:5500/api/items', {item: itemText})
      setListItems(prev => [...prev, res.data])
      setItemText('')
    }
    catch(err){
      console.log(err);
    }
  }

  //fetch todos from database
  useEffect(()=> {
    const getItemsList = async () => {
      try{
        const res = await axios.get('http://localhost:5500/api/items')
        setListItems(res.data);
        // console.log('render');
      }
      catch(err){
        console.log(err);
      }
    }
    getItemsList()
  }, [listItems])

  //Delete Items
  const deleteItem = async (id) => {
    try{
      const res = await axios.delete(`http://localhost:5500/api/items/${id}`)
      const newListItems = listItems.filter(item=> item.id !==id)
      setListItems(newListItems)
    }
    catch(err){
      console.log(err);
    }
  }

  //Update Item
  const updateItem = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.put(`http://localhost:5500/api/items/${isUpdating}`, {item: updateItemText})
      console.log(res.data);
      const updatedItemIndex = listItems.findIndex(item =>item._id === isUpdating)
      const updatedItem = listItems[updatedItemIndex].item = updateItemText
      setUpdateItemText('')
      setIsUpdating('')
    }
    catch(err){
      console.log(err);
    }
  }

  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e)=>{updateItem(e)}}>
      <input className='update-new-input' type="text" placeholder="New Todo..." value={updateItemText} onChange={e=> {setUpdateItemText(e.target.value)}}/>
      <button className="update-new-btn" type="submit">Update</button>
    </form>    
  )
 
  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder="Add Todo Item..." value={itemText} onChange={e => {setItemText(e.target.value)}}/>
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {
          listItems.map(item => (
          <div className="todo-item">
            {
              isUpdating === item._id
              ? renderUpdateForm()
              : <>
                  <p className="item-content">{item.item}</p>
                  <button className="update-item" onClick={()=>{setIsUpdating(item._id)}}>Update</button>
                  <button className="delete-item" onClick={()=>{deleteItem(item._id)}}>Delete</button>
                </>
            }
            {/* <p className="item-content">{item.item}</p>
            <button className="update-item" onClick={()=>{setIsUpdating(item._id)}}>Update</button>
            <button className="delete-item" onClick={()=>{deleteItem(item._id)}}>Delete</button> */}
        </div> 
          ))
        }
        {/* <div className="todo-item">
          <p className="item-content">This is item 1</p>
          <button className="update-item">Update</button>
          <button className="delete-item">Delete</button>
        </div>
        <div className="todo-item">
          <p className="item-content">This is item 2</p>
          <button className="update-item">Update</button>
          <button className="delete-item">Delete</button>
        </div>
        <div className="todo-item">
          <p className="item-content">This is item 3</p>
          <button className="update-item">Update</button>
          <button className="delete-item">Delete</button>
        </div> */}
      </div>
    </div>
  );
}

export default App;
