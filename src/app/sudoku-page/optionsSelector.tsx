import { FormControlLabel, Switch } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import { config } from '../../config';

interface Props {
  enableOngoingHintsMode: (_: boolean) => void,
  enableHardcoreMode: (_: boolean) => void,
  isHardCodeModeEnabled: boolean,
  isOngoingHintsModeEnabled: boolean,
} 

export default function OptionsSelector({
  enableHardcoreMode,
  enableOngoingHintsMode,
  isHardCodeModeEnabled,
  isOngoingHintsModeEnabled,
}: Props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'left',
    }}> {
      <FormControlLabel control={<RedSwitch />}
      label={config.isHardcoreModeAvailable ? 'Hardcore Adventure Survival Mode' : 'Hardcore Adventure Survival Mode (coming soon)'}
      checked={isHardCodeModeEnabled}
      disabled={!config.isHardcoreModeAvailable}
      onChange={(_event, isChecked) => {
        enableHardcoreMode(isChecked)
      }}/>
    }
      <FormControlLabel control={<GreenSwitch />} label="Ongoing Hints" checked={isOngoingHintsModeEnabled} onChange={(_event, isChecked) => {
        enableOngoingHintsMode(isChecked)
      }}/>
    </div>
  )
}

const RedSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: red[600],
    '&:hover': {
      backgroundColor: alpha(red[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: red[600],
  },
}));

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: green[600],
    '&:hover': {
      backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: green[600],
  },
}));