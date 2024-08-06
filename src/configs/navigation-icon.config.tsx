import { BsAirplane, BsFileMedical, BsHospital } from 'react-icons/bs'
import { FaPlaneDeparture } from 'react-icons/fa'
import {
  HiOutlineClipboardCheck,
  HiOutlineClipboardCopy,
  HiOutlineHome,
  HiOutlineLibrary,
  HiOutlineUserAdd,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  tickets: <BsAirplane />,
  lodging: <HiOutlineLibrary />,
  insurance: <BsHospital />,
  orders: <HiOutlineClipboardCheck />,
  assingments: <HiOutlineUserAdd />,
  users: <HiOutlineUserGroup />,
  clients: <HiOutlineUserCircle />,
  emission: <HiOutlineClipboardCopy />,
}

export default navigationIcon
