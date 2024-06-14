import {
    HiOutlineClipboardCheck,
    HiOutlineHome,
    HiOutlineUserAdd,
    HiOutlineUserCircle,
    HiOutlineUserGroup,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    orders: <HiOutlineClipboardCheck />,
    assingments: <HiOutlineUserAdd />,
    users: <HiOutlineUserGroup />,
    clients: <HiOutlineUserCircle />,
}

export default navigationIcon
