import { Button as MuiButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Button = ({ sx, onClick, label }) => {
    const theme = useTheme();

    return (
        <MuiButton sx={{
                background: theme.palette.button1.main,
                marginBottom: '15px',
                marginTop: '10px',
                ...sx
            }}
            variant="contained"
            role="button" 
            onClick={onClick}
        >
            {label.toUpperCase()}
        </MuiButton>
    );
};

export default Button;