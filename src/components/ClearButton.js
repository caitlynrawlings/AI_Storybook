import { Button as MuiButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';

const ClearButton = ({ onClick, label }) => {
    const theme = useTheme();

    return (
        <MuiButton sx={{
                background: theme.palette.button2.main,
            }}
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={onClick}
        >
            {label.toUpperCase()}
        </MuiButton>
    );
};

export default ClearButton;