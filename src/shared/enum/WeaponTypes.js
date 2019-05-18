import MachineGun from '../../state/PlayerWeapon/MachineGun'
import RocketLauncher from '../../state/PlayerWeapon/RocketLauncher'
import Shotgun from '../../state/PlayerWeapon/Shotgun'

export const WeaponIds = {
  'MachineGun': 'MachineGun',
  'RocketLauncher': 'RocketLauncher',
  'Shotgun': 'Shotgun',
}

export const WeaponTypes = {
  [ WeaponIds.MachineGun ]: MachineGun,
  [ WeaponIds.RocketLauncher ]: RocketLauncher,
  [ WeaponIds.Shotgun ]: Shotgun,
}