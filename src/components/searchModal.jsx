
import * as React from 'react';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 8,
};

export default function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <SearchIcon onClick={handleOpen}
       className='font-bold text-white w-2.5  cursor-pointer hover:bg-blue-50/10 rounded-sm ' />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}   className='border-0 rounded-2xl bg-blue-200'
>
            <input type="text" placeholder='Recherche...'
             className='w-full mx-2 my-auto outline-0 border-b-2 border-blue-300'/>
         
        </Box>
      </Modal>
    </div>
  );
}
