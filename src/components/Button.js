import { Button as MuiButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Button = ({ onClick, label }) => {
    const theme = useTheme();

    return (
        <MuiButton sx={{
                background: theme.palette.button1.main,
            }}
            variant="contained"
            onClick={onClick}
        >
            {label.toUpperCase()}
        </MuiButton>
    );
};

export default Button;