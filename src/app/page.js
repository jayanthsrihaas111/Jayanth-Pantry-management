// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { firestore } from './firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const backgroundStyle = {
  backgroundImage: 'url("https://wallpapers.com/images/featured/light-color-background-x69l528mcyszadke.jpg")', // Replace with your own image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

const categoryItems = {
  vegetables: ['Carrot', 'Broccoli', 'Spinach', 'Potato', 'Tomato'],
  dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
  meat: ['Chicken', 'Beef', 'Pork', 'Lamb', 'Turkey'],
  liquid: ['Apple Juice', 'Orange Juice', 'Grape Juice', 'Mango Juice', 'Pineapple Juice']
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [category, setCategory] = useState('vegetables');
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async () => {
    if (itemName.trim() === '') return;

    if (category !== 'custom' && !categoryItems[category].includes(itemName)) {
      setDialogMessage('Only items from the selected category can be added.');
      setDialogOpen(true);
      return;
    }

    const docRef = doc(firestore, 'inventory', itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update the existing document's quantity
      const existingData = docSnap.data();
      const newQuantity = existingData.quantity + itemQuantity;
      if (newQuantity > 10) {
        setDialogMessage('Quantity cannot exceed 10.');
        setDialogOpen(true);
        return;
      }
      await updateDoc(docRef, { quantity: newQuantity });
    } else {
      // Create a new document
      if (itemQuantity > 10) {
        setDialogMessage('Quantity cannot exceed 10.');
        setDialogOpen(true);
        return;
      }
      await setDoc(docRef, { quantity: itemQuantity, category });
    }

    await updateInventory();

    setItemName('');
    setItemQuantity(1);
    setCategory('vegetables');
    handleClose();
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(firestore, 'inventory', id));
    await updateInventory();
  };

  const decreaseQuantity = async (id) => {
    const docRef = doc(firestore, 'inventory', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const newQuantity = existingData.quantity - 1;

      if (newQuantity > 0) {
        await updateDoc(docRef, { quantity: newQuantity });
      } else {
        await deleteDoc(docRef);
      }

      await updateInventory();
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDialogClose = () => setDialogOpen(false);

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <Box sx={backgroundStyle}>
      <Typography variant="h4" sx={{ my: 4 }}>
       Jayanth's Pantry
      </Typography>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filter}
          label="Filter"
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="liquid">Liquid</MenuItem>
          <MenuItem value="vegetables">Vegetables</MenuItem>
          <MenuItem value="dairy">Dairy</MenuItem>
          <MenuItem value="meat">Meat</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Item
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => {
                setCategory(e.target.value);
                setItemName(''); // Reset item name when category changes
              }}
            >
              <MenuItem value="vegetables">Vegetables</MenuItem>
              <MenuItem value="dairy">Dairy</MenuItem>
              <MenuItem value="meat">Meat</MenuItem>
              <MenuItem value="liquid">Liquid</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            {category === 'custom' ? (
              <TextField
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            ) : (
              <>
                <InputLabel>Item Name</InputLabel>
                <Select
                  value={itemName}
                  label="Item Name"
                  onChange={(e) => setItemName(e.target.value)}
                >
                  {categoryItems[category].map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Quantity</InputLabel>
            <Select
              value={itemQuantity}
              label="Quantity"
              onChange={(e) => setItemQuantity(e.target.value)}
            >
              {[...Array(10)].map((_, index) => (
                <MenuItem key={index} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={addItem}>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Invalid Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Stack
        width="800px"
        maxHeight="300px"
        spacing={2}
        overflow="auto"
      >
        {filteredInventory.length > 0 ? filteredInventory.map(item => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f0f0f0"
            padding={2}
            borderRadius={2}
          >
            <Typography variant="h6">
              {`${item.id.charAt(0).toUpperCase() + item.id.slice(1)} - ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}`}
            </Typography>
            <Typography variant="h6">
              Quantity: {item.quantity}
            </Typography>
            <Box display="flex" gap={1}>
              <Button variant="contained" color="secondary" onClick={() => decreaseQuantity(item.id)}>
                Decrease
              </Button>
              <Button variant="contained" color="error" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </Box>
          </Box>
        )) : (
          <Typography>No items in the pantry.</Typography>
        )}
      </Stack>
    </Box>
  );
}
