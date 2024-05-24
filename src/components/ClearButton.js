import { Button as MuiButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';

// Clear button with icon used to clear all input selections.
const ClearButton = ({ sx, onClick, label }) => {
    const theme = useTheme();

    return (
        <MuiButton sx={{
                background: theme.palette.button2.main,
                ...sx
            }}
            variant="contained"
            startIcon={<ClearIcon />}
            role="button" 
            onClick={onClick}
        >
            {label.toUpperCase()}
        </MuiButton>
    );
};

export default ClearButton;