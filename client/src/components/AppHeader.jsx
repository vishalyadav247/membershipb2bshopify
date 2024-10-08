import React from 'react';
import Box from '@mui/material/Box';
import CustomizedMenus from './Select.components';
function AppHeader() {

    
    const headerWrapperCss = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid silver',
        padding: '10px'
    };
    
    return (
        <>
            <Box className='header' sx={headerWrapperCss}>
                <img src='https://cdn.discordapp.com/attachments/1291289767597834311/1293095597171015742/ickle.png?ex=6706209e&is=6704cf1e&hm=57e3f7d9be7b491b9e48c393f02da107393a37581cb86ac6aa33927eb60c8141&' alt='' width='180' />
                <CustomizedMenus/>
            </Box>
        </>
    )
}

export default AppHeader;
