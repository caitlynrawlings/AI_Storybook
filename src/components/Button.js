import { Button as MuiButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Button = ({ label }) => {
    const theme = useTheme();

    return (
        <MuiButton sx={{
                background: theme.palette.button1.main, 
            }} 
            variant="contained"
        >
            {label.toUpperCase()}
        </MuiButton>
    );
};

export default Button;