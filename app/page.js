'use client'

import Image from "next/image";
import { app, analytics } from '@/firebase'
import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, IconButton, MenuItem, Select} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  writeBatch,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: '#b3b3b3',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  outline: 'none',
}
const closeButtonStyle = {
  position: 'absolute',
  right: 8,
  top: 8,
  color: '#000',
  border: '1px solid #000',
};
const Buttons = {
  display: 'flex',
  gap: 1,
  
};

const buttonStyle = {
  minWidth: '30px',
  height: '30px',
  fontSize: '16px',
  marginLeft: '5px',
  marginRight: '5px',
  bgcolor: "#E0FFFF",
  color: "black",
};

const sectionItems = {
  snacks: ["Chocolates", "Cookies", "Donuts", "Cakes"],
  drinks: ["Coke", "Pepsi", "Sprite", "FruitBeer","Water"],
  meat: ["Chicken","Beef","Pork","Shrimp"],
  icecream: ["Vanilla", "Chocolate", "Butterscotch"],
  vegitables: ["Onion","Potato","Green Bean","Pumpkin","Kukumber","Zucchini"],
  fruits:["Apple","Banana","Grapes","Avacado"]
};

const showAlert = () => {
  alert("Soon, more sections and products will be accessible.");
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [section, setSection] = useState('snacks');
  const [quantity, setQuantity] = useState(1);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry_store'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async () => {
    if (!itemName || !section) {
      alert("Please select an item and a section.");
      return;
    }

    const docRef = doc(collection(firestore, 'pantry_store'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: existingQuantity, section: existingSection } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity, section: existingSection });
    } else {
      await setDoc(docRef, { quantity, section });
    }

    await updateInventory();
    setItemName('');
    setQuantity(1);
    handleClose();
  };

  const updateQuantity = async (item, change) => {
    const docRef = doc(collection(firestore, 'pantry_store'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, section } = docSnap.data();
      const newQuantity = quantity + change;

      if (newQuantity <= 0) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: newQuantity, section });
      }
    }

    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName('');
    setQuantity(1);
  };
  const deleteAllItems = async () => {
    const snapshot = await getDocs(collection(firestore, 'pantry_store'));
    const batch = writeBatch(firestore);

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    updateInventory();
    alert("All items have been deleted.");
  };
  return (
    <Box
    sx={{
      width: "100vw",
        height: "100vh",
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        overflow: "hidden",
        backgroundImage: "url('/images/Pantry+image.jpg')", // Path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }}
    >
      <Box
        width="100%"
        height="100px"
        bgcolor={'#F5F5DC'} 
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingY={2}
        position="fixed"
        top={0}
        zIndex={1}
      >
        <Typography variant={'h1'} color={'#333'} textAlign={'center'}>
          Pantry Store
        </Typography>
        
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          <IconButton aria-label="close" sx={closeButtonStyle} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h2" component="h2" textAlign={'center'}>
            Items
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <Select
              labelId="section-select-label"
              id="section-select"
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setItemName(''); // Reset item name when section changes
              }}
              fullWidth
            >
              <MenuItem value="" disabled>Select a section</MenuItem>
              {Object.keys(sectionItems).map((sectionKey) => (
                <MenuItem key={sectionKey} value={sectionKey}>
                  {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
                </MenuItem>
              ))}
            </Select>
            <Select
              labelId="item-select-label"
              id="item-select"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>Select an item</MenuItem>
              {sectionItems[section] && sectionItems[section].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            <Select
              labelId="quantity-select-label"
              id="quantity-select"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
            >
              <MenuItem value="" disabled>Select quantity</MenuItem>
              {[1, 2, 3, 4, 5].map((qty) => (
                <MenuItem key={qty} value={qty}>
                  {qty}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="outlined"
              onClick={addItem}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box border={'1px solid #333'} >
        <Stack width="1000px" height="100px" spacing={2} overflow={'auto'}>
          <Box
            width="100%"
            minHeight="100%"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={15}
            
          >
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              Section
            </Typography>
            <Typography variant={'h3'} color={'#333'} textAlign={'center'} >
              Items
            </Typography>
            <Typography variant={'h3'} color={'#333'} textAlign={'center'} >
              Quantity
            </Typography>
            <Typography variant={'h3'} color={'#333'} textAlign={'center'} >
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Box border={'1px solid #333'}  bgcolor={'#F5F5DC'}>
        <Stack width="1000px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({ name, quantity , section}) => (
            <Box
              key={name}
              width="100%"
              minHeight="50px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              paddingX={5}
            >
              <Typography variant={'h6'} color={'#333'} textAlign={'center'} flex={1}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Typography>
              <Typography variant={'h6'} color={'#333'} textAlign={'center'} flex={1}>
                {name}
              </Typography>
              <Typography variant={'h6'} color={'#333'} textAlign={'center'} flex={1}>
                {quantity}
              </Typography>
              <Box sx={Buttons}>
                <Button 
                 sx={buttonStyle}
                  variant="contained"
                  onClick={() => updateQuantity(name, 1)}
                >+</Button>
                <Button 
                sx={buttonStyle}
                  variant="contained"
                  onClick={() => updateQuantity(name, -1)}
                >-</Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={buttonStyle}
      >Add New Item</Button>
      
       <Button 
        variant="contained" 
        onClick={deleteAllItems}
        sx={buttonStyle}
      >
        Refresh
      </Button>
      <Box
  sx={{
    position: 'fixed',
    top: 50,// Adjust the value to control the distance from the bottom
    right: 16,   // Adjust the value to control the distance from the left
    zIndex: 80, // Ensure it appears above other elements
  }}
>
  <Button
    variant="contained"
    onClick={showAlert}
    sx={buttonStyle}
  >
    More
  </Button>
</Box>
    </Box>
    
  )
}
