import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa'
import {
  HiOutlineClipboardCheck,
  HiOutlineClipboardCopy,
  HiOutlineHome,
  HiOutlineUserAdd,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  tickets: <FaPlaneDeparture />,
  orders: <HiOutlineClipboardCheck />,
  assingments: <HiOutlineUserAdd />,
  users: <HiOutlineUserGroup />,
  clients: <HiOutlineUserCircle />,
  emission: <HiOutlineClipboardCopy />,
}

export default navigationIcon
