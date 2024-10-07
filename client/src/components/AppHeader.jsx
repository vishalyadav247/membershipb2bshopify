import React from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
function AppHeader() {

    
    const headerWrapperCss = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid silver',
        padding: '10px'
    }
    
    return (
        <>
            <Box className='header' sx={headerWrapperCss}>
                <img src='site_logo.webp' alt='' width='180' />
                <Button variant="outlined">Login</Button>
            </Box>
        </>
    )
}

export default AppHeader;
