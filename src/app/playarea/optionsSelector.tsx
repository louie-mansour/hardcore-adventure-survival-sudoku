import { FormControlLabel, Switch } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';

export enum GameOption {
  HardcoreMode = 'hardcoreMode',
  OngoingHintsMode = 'ongoingHintsMode',
}

interface Props {
  enableOngoingHintsMode: (_: boolean) => void,
  enableHardcoreMode: (_: boolean) => void,
  isHardcoreModeEnabled: boolean,
  isOngoingHintsModeEnabled: boolean,
}

export default function OptionsSelector({
  enableHardcoreMode,
  enableOngoingHintsMode,
  isHardcoreModeEnabled,
  isOngoingHintsModeEnabled,
}: Props) {
  return (
    <div className='flex flex-col justify-left'>
      <FormControlLabel control={<RedSwitch />}
        label='Hardcore Adventure Survival Mode'
        checked={isHardcoreModeEnabled}
        disabled={isOngoingHintsModeEnabled}
        onChange={(_event, isChecked) => {
          enableHardcoreMode(isChecked)
        }}
    />
    
      <FormControlLabel control={<GreenSwitch />}
        label="Ongoing Hints"
        checked={isOngoingHintsModeEnabled}
        disabled={isHardcoreModeEnabled}
        onChange={(_event, isChecked) => {
          enableOngoingHintsMode(isChecked)
        }}
      />
    </div>
  )
}

// hmm don't love this
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